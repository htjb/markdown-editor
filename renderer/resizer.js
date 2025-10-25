const handles = [document.getElementById('preview-resizer'),
                    document.getElementById('file-tree-resizer')];

handles.forEach((elm) => elm.addEventListener('mousedown', (e) => {
  e.preventDefault(); // prevent text selection
  const startX = e.clientX; // location where the mouse is pressed
  let startWidth; // initial width of the pane being resized
  if (elm.id === 'file-tree-resizer')
      startWidth = fileTree.offsetWidth;
  else
    startWidth = previewPane.offsetWidth;

  function onMouseMove(e) {
    const dx = startX - e.clientX;  // move left or right
    if (elm.id === 'file-tree-resizer')
        fileTree.style.setProperty('--file-tree-width', `${Math.max(100, startWidth - dx)}px`);
    else
        previewPane.style.setProperty('--preview-width', `${Math.max(100, startWidth + dx)}px`);
  }

  function onMouseUp() {
    // remove the event listeners from the window
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  }

  // add event listeners to the whole window because 
  // user might move the mouse out of the handle while dragging
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
    })
);