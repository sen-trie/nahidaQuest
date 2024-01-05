const toggleMenu = () => {
    const burgerMenu = document.getElementById('burgerMenu');
    if (burgerMenu.classList.contains('mobile-hidden')) {
        burgerMenu.classList.remove('mobile-hidden');
        burgerMenu.classList.add('flex-column');
    } else {
        burgerMenu.classList.add('mobile-hidden');
        burgerMenu.classList.remove('flex-column');
    }
}

class Header extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <header>
                <img src='../assets/settings/nahidaQuest.webp' alt='nahidaQuest logo'>
                <nav>
                    <a href="https://nahidaquest.com/">home</a>
                    <a href="./feedback">feedback</a>
                    <a href="./credits">credits</a>
                    <div class='flex-row play-button'>
                        <a href="./play">Play!</a>
                    </div>
                </nav>
                <button class='burger' onClick='toggleMenu()'>Menu</button>
                <div id='burgerMenu' class='mobile-hidden'>
                    <a class='flex-column' href="./index">home</a>
                    <a class='flex-column' href="./feedback">feedback</a>
                    <a class='flex-column' href="./credits">credits</a>
                    <a class='flex-column' href="./play">Play!</a>
                </div>
            </header>
        `;
    }
}

customElements.define('header-component', Header);
