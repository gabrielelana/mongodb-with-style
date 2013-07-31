" autoload the local .vimrc file you need to have
" https://github.com/MarcWeber/vim-addon-local-vimrc
" plugin installed

nnoremap <silent> <Leader>r :call RunCurrentFile()<CR>

function! RunCurrentFile()
  exec '!rake run\[' . expand('%:p') . '\]'
endfunction
