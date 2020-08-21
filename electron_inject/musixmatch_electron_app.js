translate = () => {
    let lyricsNodes = document.querySelectorAll('div.backgroundLyrics > div:nth-child(1) div[dir="auto"]')
    let lyricsPartial = [...lyricsNodes]
        .map(e => e.innerText.replace(/\n/g, '|'))
        .join('\n')
    const langCodeTo = 'zh-Hant'
    fetch(`https://www.google.com/async/lyrics_translate?async=lyrics_partial:${encodeURIComponent(lyricsPartial)},lyrics_full:%20,title:%20,lang_code_from:en,lang_code_to:${langCodeTo},exp_ui_ctx:2,_id:gws-plugins-knowledge-verticals-music__translated-lyrics-container,_pms:s,_fmt:pc`)
        .then(response => response.text())
        .then(text => {
            let result = text.split(';')[3]
            let frag = document.createRange().createContextualFragment(result);
            let resultArr = [...frag.querySelectorAll('div > div > span[jsname]')]
                .map(e => e.innerText.replace(/\|/g, '\n'))
            let lyricsArr = []
            for (let i = 0; i < resultArr.length; i += 2) {
                lyricsArr.push([resultArr[i + 1], resultArr[i]])
            }
            let i = -1
            lyricsNodes.forEach(e => {
                i++
                if (e.innerText === '...') return
                e.innerText = e.innerText.replace(/\n$/, '')
                e.innerText += `\n${lyricsArr[i][1]}`
            })
        })
}

observer = new MutationObserver(mutations => {
    mutations.forEach(({addedNodes}) => {
        addedNodes.forEach(node => {
            // ele = node.querySelector('.backgroundLyrics')
            if (node.innerText !== 'End') return
            console.log(`backgroundLyrics changed!`)
            translate()
        })
    })
})

// Starts the monitoring
observer.observe(document.documentElement, {
    attributes: true,
    // characterData: true,
    childList: true,
    subtree: true,
    // attributeOldValue: true,
    // characterDataOldValue: true
})
