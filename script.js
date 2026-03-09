const owner = 'pixeltoast';
const repo = 'tu-repositorio';
const path = 'libros';
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
const grid = document.getElementById('book-grid');

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

async function loadBooks() {
    const response = await fetch(apiUrl);
    if (!response.ok) return;
    const files = await response.json();
    const pdfs = files.filter(file => file.name.endsWith('.pdf'));

    for (const pdf of pdfs) {
        createBookCard(pdf);
    }
}

function createBookCard(file) {
    const card = document.createElement('a');
    card.className = 'book-card';
    card.href = file.download_url;
    card.target = '_blank';

    const coverDiv = document.createElement('div');
    coverDiv.className = 'book-cover';
    const canvas = document.createElement('canvas');
    coverDiv.appendChild(canvas);

    const infoDiv = document.createElement('div');
    infoDiv.className = 'book-info';
    const title = document.createElement('p');
    title.className = 'book-title';
    title.textContent = file.name.replace('.pdf', '');
    infoDiv.appendChild(title);

    card.appendChild(coverDiv);
    card.appendChild(infoDiv);
    grid.appendChild(card);

    renderCover(file.download_url, canvas);
}

async function renderCover(url, canvas) {
    try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.0 });
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        await page.render(renderContext).promise;
    } catch (e) {
        canvas.style.display = 'none';
        canvas.parentElement.innerHTML = '<span>Portada no disponible</span>';
    }
}

loadBooks();
