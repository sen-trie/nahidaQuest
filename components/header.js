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
                <a class='logo-link clickable' href="./">
                    <img src='../assets/settings/nahidaQuest.webp' alt='nahidaQuest logo'>
                </a>
                <nav>
                    <a href="./wiki">wiki</a>
                    <a href="./feedback">feedback</a>
                    <a href="./credits">credits</a>
                    <div class='flex-row play-button'>
                        <a href="./play">Play!</a>
                    </div>
                </nav>
                <button class='burger' onClick='toggleMenu()'>Menu</button>
                <div id='burgerMenu' class='mobile-hidden'>
                    <a class='flex-column' href="./">Home</a>
                    <a class='flex-column' href="./wiki">Wiki</a>
                    <a class='flex-column' href="./feedback">Feedback</a>
                    <a class='flex-column' href="./credits">Credits</a>
                    <a class='flex-column play-button' href="./play">Play!</a>
                    <blocker onClick='toggleMenu()'></blocker>
                </div>
            </header>
        `;
    }
}

customElements.define('header-component', Header);
