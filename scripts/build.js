import { data } from './data.js';
import fs from 'fs';

let html = fs.readFileSync('../index.html').toString();

data.forEach(gallery => {
    const result = `<!-- ${gallery.id} -->\n<div class="row tm-mb-30 tm-gallery ${gallery.id}">` + gallery.entries.map(entry => renderGalleryItem(entry)).join('') + `<!-- ${gallery.id} -->\n</div>`;
    const regex = new RegExp(`<!-- ${gallery.id}[\\s\\S]*?<!-- ${gallery.id} -->`);
    html = html.replace(regex, result)
})

fs.writeFileSync('../index.html', html)

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