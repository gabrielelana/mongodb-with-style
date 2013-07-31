// cell looks like
//
// {
//    _id: ObjectId(),
//    x: <X_COORDINATE>,
//    y: <Y_COORDINATE>,
//    bornAt: ISODate(),
//    generation: <N>
// }


this.gol = (function() {

  function map() {
    var generation = this.generation + 1
    for (var ny=this.y-1; ny<=this.y+1; ny++) {
      for (var nx=this.x-1; nx<=this.x+1; nx++) {
        if (this.x === nx && this.y === ny) {
          emit([nx, ny].join('-'), {x:nx, y:ny, neighbours:0, generation:generation, wasAlive: true})
        } else {
          emit([nx, ny].join('-'), {x:nx, y:ny, neighbours:1, generation:generation})
        }
      }
    }
  }

  function reduce(id, neighbours) {
    return neighbours.reduce(function(result, neighbour) {
      return {
        x: neighbour.x,
        y: neighbour.y,
        generation: neighbour.generation,
        neighbours: result.neighbours + neighbour.neighbours,
        wasAlive: result.wasAlive || neighbour.wasAlive
      }
    }, {x: 0, y: 0, generation: 0, neighbours: 0, wasAlive: false})
  }


  function finalize(id, cell) {
    if (cell.wasAlive && cell.neighbours < 2) {
      return null;
    }
    if (cell.wasAlive && cell.neighbours > 3) {
      return null;
    }
    if (!cell.wasAlive && cell.neighbours !== 3) {
      return null; 
    }
    return {
      x: cell.x,
      y: cell.y,
      bornAt: ISODate(),
      generation: cell.generation,
    }
  }

  function evolve(db) {
    var evolution = db.meta.findAndModify({
      query: {_id: 'evolution', lock: false},
      update: {
        $set: {lock: true, startedAt: ISODate()},
        $inc: {generation: 1}
      },
      new: true,
      upsert: true
    })

    var currentGenerationNumber = evolution.generation,
        currentGenerationName = ['generation', currentGenerationNumber].join('-'),
        nextGenerationName = ['generation', currentGenerationNumber + 1].join('-')

    var result = db[currentGenerationName].mapReduce(map, reduce, {finalize: finalize, out: 'last_evolution'})

    db['last_evolution'].find().forEach(function(result) {
      if (result.value !== null) {
        db[nextGenerationName].insert(result.value)
      }
    })

    db.meta.findAndModify({
      query: {_id: 'evolution', lock: true},
      update: {
        $set: {lock: false, endedAt: ISODate()}
      },
      upsert: true
    })

    return true
  }

  return {map: map, reduce: reduce, finalize: finalize, evolve: evolve}

})()



