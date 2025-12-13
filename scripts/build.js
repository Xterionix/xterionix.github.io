import { data } from './data.js';
import fs from 'fs';
import prettier from 'prettier';

let html = fs.readFileSync('../index.html').toString();
let galleries = '<!-- gallery-start -->\n';

data.forEach(gallery => {
    galleries += renderGallery(gallery.title, gallery.id, gallery.entries.map(entry => renderGalleryItem(entry)).join(''));
})

galleries += '\n<!-- gallery-end -->';
html = html.replace(/<!-- gallery-start -->[\s\S]*?<!-- gallery-end -->/, galleries)
html = await prettier.format(html, { parser: 'html', htmlWhitespaceSensitivity: 'ignore', printWidth: 1000 })

fs.writeFileSync('../index.html', html)

function renderGallery(title, id, content) {
    return `<div class="container-fluid">
        <div class="row mb-4">
            <h2 class="col-6">
                ${title}
            </h2>
        </div>
        <div class="row tm-mb-30 tm-gallery" id="${id}">
            ${content}
        </div>
    </div>`
}

function renderGalleryItem(item) {
    const credit = item.credit ? " credit-creeper" : "";
    const id = item.id ? ` id="${item.id}"` : "";
    const tags = item.tags ? ` data-tags="${item.tags}"` : "";

    if (item.type === "video") {
        return `
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 gallery-item"${id}${tags}>
                <figure class="effect-ming tm-video-item card border-secondary">
                    <video controls alt="Video" class="card-img${credit}" preload="none" poster="img/poster/${item.poster}">
                        <source src="./video/${item.src}" type="video/mp4">
                    </video>
                    <figcaption class="d-flex align-items-center justify-content-center">
                        <h2>${item.title}</h2>
                    </figcaption>
                </figure>
            </div>`;
    } else if (item.type === "image") {
        const layout = item.layout === "alternate" ? "align-items-end justify-content-end alternate" : "align-items-center justify-content-center";
        let caption = `<a href="${item.link}" target="_blank">View more</a>`;
        if (item.title) caption += `\n                        <h2>${item.title}</h2>`;
        if (item.subtitle) caption += `\n                        <h6 class="bottom-left pb-1 pe-1">${item.subtitle}</h6>`;

        return `
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-1 gallery-item" ${id}${tags}>
                <figure class="effect-ming tm-video-item card border-secondary">
                    <img src="${item.src}">
                    <figcaption class="d-flex ${layout}">
                        ${caption}
                    </figcaption>
                </figure>
            </div>`;
    }
}