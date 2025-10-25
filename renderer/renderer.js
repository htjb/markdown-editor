let collapseFileTree = document.getElementById('collapse-file-tree');
let fileTree = document.getElementById('file-tree');
let previewButton = document.getElementById('preview-button');
let previewPane = document.getElementById('preview-pane');
let openDirButton = document.getElementById('open-folder-button');

let workingDir = '';

collapseFileTree.addEventListener('click', () => {
    fileTree.classList.toggle('collapsed');
})

previewButton.addEventListener('click', () => {
    previewPane.classList.toggle('collapsed');
})

let noteContent = document.getElementById('note-area');
noteContent.addEventListener('input', (event) => {
    let post = event.target.value;
    previewPane.innerHTML = marked.parse(post, 
            {breaks: true})
    
    previewPane.querySelectorAll('img').forEach((img) => {
        let src = img.getAttribute('src');
        img.setAttribute('src', workingDir + src.split('.')[1] + '.' + src.split('.')[2]);
    });
    
    renderMathInElement(previewPane, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
        ],
        throwOnError: false
        });

    // Highlight code blocks
    previewPane.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
});

async function showFiles(dirPath, element=null) {
  if (dirPath === '') return;
  if (element === null) {
    fileTree.innerHTML = ''; // clear current file tree
    fileTree.appendChild(document.createElement('br'));
  } else {
    element.appendChild(document.createElement('br'));
  }
  const files = await window.api.readDir(dirPath);
  
  
  files.forEach(file => {
    const div = document.createElement('a');
    div.textContent = file.name + (file.isDir ? '/' : '');
    div.className = file.isDir ? 'folder' : 'file';
    if (element) {
        element.appendChild(div);
        element.appendChild(document.createElement('br'));
    }else {
      fileTree.appendChild(div);
      fileTree.appendChild(document.createElement('br'));
    }
  });

  document.querySelectorAll('#file-tree .folder').forEach(folder => {
  folder.addEventListener('click', () => {
    console.log(`Folder ${folder.textContent} clicked`);
    const subtree = document.createElement('div');
    folder.insertAdjacentElement('afterend', subtree);
    subtree.style.marginLeft = '15px';
    showFiles(dirPath + '/' + folder.textContent.slice(0, -1), subtree);
    });
  });

  document.querySelectorAll('#file-tree .file').forEach(file => {
    file.addEventListener('click', () => {
        console.log(`File ${file.textContent} clicked`);
        if (file.textContent.endsWith('.md')) {
            const fullPath = dirPath + '/' + file.textContent
            fetch(`file://${fullPath}`)
            .then(response => response.text())
            .then(data => {
                noteContent.value = data;
                // Trigger input event to update preview
                noteContent.dispatchEvent(new Event('input'));
            })
        }
      // Add logic to open/display the file
      });
    });
}

openDirButton.addEventListener('click', async () => {
  const dirPath = await window.api.openDialog();
  if (dirPath) {
    showFiles(dirPath);
  }
  workingDir = dirPath;
});
