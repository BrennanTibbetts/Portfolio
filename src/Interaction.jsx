import { Leva } from 'leva'
import React, { useState } from 'react'

export default function Interaction() {

    const [levaHidden, setLevaHidden] = useState(true)

    window.addEventListener('keydown', (e) => {
        if(e.key === 'h') {
            setLevaHidden(!levaHidden)
        }
    })

    return <>
        <button className="entry" onClick={() => {} }>
            <img src="/css/clean-arrow.svg" />
        </button>
        <button className="next" onClick={() => {} }>
            <img src="/css/clean-arrow.svg" />
        </button>
        <button className="previous" onClick={() => {} }>
            <img src="/css/clean-arrow.svg" />
        </button>
        <Leva hidden={levaHidden} />
    </>
}