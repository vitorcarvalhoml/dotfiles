"NERDTree configuration"
map <C-b> :NERDTreeToggle<CR>
let NERDTreeIgnore=['\.aux$', '\.bbl$', '\.blg$', '\.brf$', '\.fls$', '\.idx']
autocmd StdinReadPre * let s:std_in=1
autocmd VimEnter * if argc() == 1 && isdirectory(argv()[0]) && !exists("s:std_in") | exe 'NERDTree' argv()[0] | wincmd p | ene | endif

"Makeshift configuration"
let g:makeshift_chdir = 1

"Neocomplete configuration"
let g:vimtex_compiler_latexmk = {'callback' : 0}

"Markdown preview configuration"
let vim_markdown_preview_github=1
let vim_markdown_preview_browser='Google Chrome'
