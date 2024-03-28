
export default function divStyle(transform) {

    const style = {
        position: 'absolute',
        top: '45%',
        left: '50%',
        width: '70vw',
        height: '70vh',
        transform: transform,
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '10px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '1em',
        transition: '0.5s',
        transitionDelay: '1s',
        color: 'rbga(28, 28, 28, 1.0)',
    }

    return style
}
