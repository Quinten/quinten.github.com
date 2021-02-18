nFrames = 64;

let clip = window.location.search.substr(1);
if (clip.length) {
    (async () => {
        let newModule = await import('./clips/' + clip + '.js').catch(e => { statustext.innerHTML = 'Clip not found. Use url "makegif.html?clipname" without ".js"'; });
        newModule.add();
        let bg = addClip({unshift: true});
        bg.draw = (time) => {
            ctx.save();
            ctx.fillStyle = canvas.style.backgroundColor;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        };
        let rendered = false;
        let gif = new GIF({
            workers: 2,
            quality: 5
        });
        gif.on('finished', (blob) => {
            let img = document.querySelector('img');
            img.src = URL.createObjectURL(blob);
            rendered = true;
            canvas.style.display = 'none';
            statustext.innerHTML = 'Done. Right click on gif to save.';
        });
        let hook = addClip();
        hook.draw = (time) => {
            if (frameIndex >= startFrame) {
                gif.addFrame(canvas, {
                    copy: true,
                    delay: 40
                });
            }
            if (frameIndex >= nFrames) {
                removeClip(bg);
                removeClip(hook);
                newModule.remove();
                gif.render();
                statustext.innerHTML = 'Rendering gif...';
            }
        };
        frameIndex = 0;
    })();
}
