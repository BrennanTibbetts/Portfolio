
export default function divStyle(transform) {

    const style = {
        position: 'absolute',
        top: '45%',
        left: '50%',
        width: '80vw',
        height: '70vh',
        transform: transform,
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        transition: '0.5s',
        transitionDelay: '1s',
        color: 'white'
    }

    return style
}
