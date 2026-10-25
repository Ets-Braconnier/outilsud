/** Store gallery: exact filenames generated from the uploaded image folder. */
import {$} from './common.js';
import {photos} from './photos.js';
const image = $('shopSlide');
const counter = $('shopCounter');
let index = 0;
let timer;
let request = 0;
function show(nextIndex) {
  if (!photos.length) return;
  const next = (nextIndex + photos.length) % photos.length;
  const url = `assets/images/magasin/${encodeURIComponent(photos[next])}`;
  const preload = new Image();
  const currentRequest = ++request;
  preload.onload = () => {
    if (currentRequest !== request) return;
    index = next;
    image.src = url;
    image.alt = `Photo du magasin Outilsud ${index + 1}`;
    counter.textContent = `${index + 1} / ${photos.length}`;
  };
  preload.onerror = () => {
    if (currentRequest !== request) return;
    console.warn('Image impossible à charger :', url);
    if (photos.length > 1) show(next + 1);
  };
  preload.src = url;
}
function start() {
  clearInterval(timer);
  if (photos.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches && !document.hidden) timer = setInterval(() => show(index + 1), 4000);
}
$('shopPrev').addEventListener('click', () => { show(index - 1); start(); });
$('shopNext').addEventListener('click', () => { show(index + 1); start(); });
document.addEventListener('visibilitychange', start);
show(0);
start();
