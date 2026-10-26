const list = document.getElementById('list');
const title = document.getElementById('title');
const text = document.getElementById('text');

async function refresh() {
  list.innerHTML = '';
  const notes = await window.notesAPI.list();
  notes.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name.replace('.txt', '');
    li.onclick = async () => {
      title.value = name.replace('.txt', '');
      text.value = await window.notesAPI.read(name);
    };
    const del = document.createElement('button');
    del.textContent = 'x';
    del.onclick = async (e) => {
      e.stopPropagation();
      await window.notesAPI.remove(name);
      refresh();
    };
    li.appendChild(del);
    list.appendChild(li);
  });
}

document.getElementById('save').onclick = async () => {
  if (!title.value.trim()) return alert('Enter a title');
  await window.notesAPI.save(title.value.trim(), text.value);
  refresh();
};

document.getElementById('export').onclick = async () => {
  if (!title.value.trim()) return alert('Enter a title');
  await window.notesAPI.exportNote(title.value.trim(), text.value);
};

refresh();
