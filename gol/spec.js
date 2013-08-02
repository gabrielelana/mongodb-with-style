load('gol.js')


;(function(global) {

  return [
    function mapIsDefined() {
      assert.eq('function', typeof(gol.map))
    },

    function reduceIsDefined() {
      assert.eq('function', typeof(gol.reduce))
    },

    function finalizeIsDefined() {
      assert.eq('function', typeof(gol.finalize))
    },

    function mapShouldEmit8NeighboursForEachCell() {
      var numberOfNeighboursEmitted = 0,
          cell = {x:1, y:1}

      global.emit = function(id, neighbour) {
        numberOfNeighboursEmitted += neighbour.neighbours
      }

      gol.map.apply(cell)

      assert.eq(8, numberOfNeighboursEmitted, 'every cell has 8 neighbours')
    },

    function mapShouldEmitHimselfToSayThatHeWasAlive() {
      var himself = null, cell = {x:1, y:1}

      global.emit = function(id, neighbour) {
        if (neighbour.x === cell.x && neighbour.y === cell.y) {
          assert.isnull(himself)
          himself = neighbour
        }
      }

      gol.map.apply(cell)

      assert(himself.wasAlive, 'every cell should emit the information that he was alive')
    },

    function mapShouldEmitNeighboursWithCoordinates() {
      var neighbours = [], cell = {x:1, y:1}

      global.emit = function(id, neighbour) {
        neighbours.push({x: neighbour.x, y: neighbour.y})
      }

      gol.map.apply(cell)

      assert.contains({x:0, y:0}, neighbours)
      assert.contains({x:0, y:1}, neighbours)
      assert.contains({x:0, y:2}, neighbours)
      assert.contains({x:1, y:0}, neighbours)
      assert.contains({x:1, y:1}, neighbours)
      assert.contains({x:1, y:2}, neighbours)
      assert.contains({x:2, y:0}, neighbours)
      assert.contains({x:2, y:1}, neighbours)
      assert.contains({x:2, y:2}, neighbours)
    },

    function mapShouldEmitNeighboursIdBasedOnCoordinates() {
      var ids = [], cell = {x:1, y:1}

      global.emit = function(id, neighbour) {
        ids.push(id)
      }

      gol.map.apply(cell)

      assert.contains('0-0', ids)
      assert.contains('0-1', ids)
      assert.contains('0-2', ids)
      assert.contains('1-0', ids)
      assert.contains('1-1', ids)
      assert.contains('1-2', ids)
      assert.contains('2-0', ids)
      assert.contains('2-1', ids)
      assert.contains('2-2', ids)
    },

    function mapShouldEmitNeighboursWithNeighbourCountInitializedAtOne() {
      var countOfNeighbours = [], cell = {x:1, y:1}

      global.emit = function(id, neighbour) {
        if (!(neighbour.x === cell.x && neighbour.y === cell.y)) {
          countOfNeighbours.push(neighbour.neighbours)
        }
      }

      gol.map.apply(cell)

      assert.eq([1,1,1,1,1,1,1,1], countOfNeighbours)
    },

    function mapShouldEmitNeighboursToTheNextGeneration() {
      var generationOfNeighbours = [], cell = {x:1, y:1, generation: 1}

      global.emit = function(id, neighbour) {
        generationOfNeighbours.push(neighbour.generation)
      }

      gol.map.apply(cell)

      assert.eq([2,2,2,2,2,2,2,2,2], generationOfNeighbours)
    },

    function reduceShouldKeepSameCoordinates() {
      var neighbour = {x:1, y:1, neighbours:1, generation:2}
      var nextGenerationCell = gol.reduce(null, [neighbour])

      assert.eq(neighbour.x, nextGenerationCell.x)
      assert.eq(neighbour.y, nextGenerationCell.y)
    },

    function reduceShouldKeepSameGeneration() {
      var neighbour = {x:1, y:1, neighbours:1, generation:2}
      var nextGenerationCell = gol.reduce(null, [neighbour])

      assert.eq(neighbour.generation, nextGenerationCell.generation)
    },

    function reduceShouldKeepThatHeWasAlive() {
      var neighbour = {x:1, y:1, neighbours:1, generation:2, wasAlive: true}
      var nextGenerationCell = gol.reduce(null, [neighbour])

      assert(nextGenerationCell.wasAlive)
    },

    function reduceShouldKeepThatHeWasNotAlive() {
      var neighbour = {x:1, y:1, neighbours:1, generation:2}
      var nextGenerationCell = gol.reduce(null, [neighbour])

      assert(!nextGenerationCell.wasAlive)
    },

    function reduceShouldCountNumberOfNeighbours() {
      var neighbour = {x:1, y:1, neighbours:1, generation:2}
      var nextGenerationCell = gol.reduce(null, [neighbour, neighbour, neighbour])

      assert.eq(3, nextGenerationCell.neighbours)
    },

    function finalizeShouldKillDieCellWhenLessThanTwoNeighbours() {
      var neighbours = {x:1, y:1, neighbours:1, wasAlive: true, generation: 2}
      var nextGenerationCell = gol.finalize(null, neighbours)

      assert.isnull(nextGenerationCell)
    },

    function finalizeShouldKillCellWhenMoreThanThreeNeighbours() {
      var neighbours = {x:1, y:1, neighbours:4, wasAlive: true, generation: 2}
      var nextGenerationCell = gol.finalize(null, neighbours)

      assert.isnull(nextGenerationCell)
    },

    function finalizeShouldLetLiveCellOtherwise() {
      var neighbours = {x:1, y:1, neighbours:3, wasAlive: true, generation: 2}
      var nextGenerationCell = gol.finalize(null, neighbours)

      assert(nextGenerationCell, 'cell should be kept alive')
    },

    function finalizeShouldBringToLifeDeadCellWithExactlyThreeNeighbours() {
      var neighbours = {x:1, y:1, neighbours:3, wasAlive: false, generation: 2}
      var nextGenerationCell = gol.finalize(null, neighbours)

      assert(nextGenerationCell, 'cell should be kept alive')
    },

    function finalizeShouldLetDeadCellWithLessThanThreeNeighbours() {
      var neighbours = {x:1, y:1, neighbours:2, wasAlive: false, generation: 2}
      var nextGenerationCell = gol.finalize(null, neighbours)

      assert.isnull(nextGenerationCell)
    },

    function blinkerOneStepEvolution() {
      var db = global.db.getSisterDB('gol')

      db.dropDatabase()
      db['generation-1'].insert([
        {x:0, y:1, generation:1, bornAt:ISODate()},
        {x:1, y:1, generation:1, bornAt:ISODate()},
        {x:2, y:1, generation:1, bornAt:ISODate()},
      ])

      gol.evolve(db)

      assert.eq(
        [
          {x:1, y:0, generation:2},
          {x:1, y:1, generation:2},
          {x:1, y:2, generation:2},
        ], 
        db['generation-2'].find({}, {x:1, y:1, generation:1, _id:0}).toArray()
      )
    },

    function blinkerTwoStepEvolution() {
      var db = global.db.getSisterDB('gol')

      db.dropDatabase()
      db['generation-1'].insert([
        {x:0, y:1, generation:1, bornAt:ISODate()},
        {x:1, y:1, generation:1, bornAt:ISODate()},
        {x:2, y:1, generation:1, bornAt:ISODate()},
      ])

      gol.evolve(db)
      gol.evolve(db)

      assert.eq(
        [
          {x:0, y:1, generation:3},
          {x:1, y:1, generation:3},
          {x:2, y:1, generation:3},
        ], 
        db['generation-3'].find({}, {x:1, y:1, generation:1, _id:0}).toArray()
      )
    }
  ]

})(this).forEach(function(f) { 
  print('>>> ' + f.name)
  f()
})
