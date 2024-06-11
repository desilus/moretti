document.addEventListener("DOMContentLoaded", function() {
    const domande = [
        { domanda: "Indicazioni tappa 9 - PAKISTAN: ...", rispostaCorretta: "arrosto", immagine: "immagini/pakistan.svg" },
        { domanda: "Indicazioni tappa 10 - ROMANIA: ...", rispostaCorretta: "tiramisu", immagine: "immagini/romania.svg" },
        { domanda: "Indicazioni tappa 11 - SENEGAL: ...", rispostaCorretta: "meringata", immagine: "immagini/senegal.svg" },
        { domanda: "Indicazioni tappa 12 - TUNISIA: ...", rispostaCorretta: "pastiera", immagine: "immagini/tunisia.svg" },
        { domanda: "Indicazioni tappa 13 - UCRAINA: ...", rispostaCorretta: "cannoli", immagine: "immagini/ucraina.svg" },
        { domanda: "Indicazioni tappa 14 - SPAGNA: ...", rispostaCorretta: "sorbetto", immagine: "immagini/spagna.svg" },
        { domanda: "Indicazioni tappa 15 - BRASILE: ...", rispostaCorretta: "crostata", immagine: "immagini/brasile.svg" }
    ];

    const squadra = parseInt(document.body.getAttribute('data-squadra'), 7);
    const domandeContainer = document.getElementById("domande-container");
    const timbroContainer = document.getElementById("timbro-container");
    const progressBar = document.getElementById("progress-bar");

    function getDomandePerSquadra(domande, squadra) {
        const start = (squadra - 1) % domande.length;
        const orderedQuestions = [];

        for (let i = 0; i < domande.length; i++) {
            orderedQuestions.push(domande[(start + i) % domande.length]);
        }

        return orderedQuestions;
    }

    const domandePerSquadra = getDomandePerSquadra(domande, squadra);
    let currentIndex = localStorage.getItem('currentIndex') ? parseInt(localStorage.getItem('currentIndex')) : 0;
    let risposteCorrette = localStorage.getItem('risposteCorrette') ? parseInt(localStorage.getItem('risposteCorrette')) : 0;

    domandePerSquadra.forEach((domandaObj, index) => {
        const div = document.createElement("div");
        div.className = "domanda";
        div.innerHTML = `
            <label for="domanda${index + 1}">${domandaObj.domanda}</label>
            <div class="cici"></div>
            <p>CODICE</p>
            <input type="text" class="domandaDinamica" id="domanda${index + 1}" name="domanda${index + 1}">
        `;
        domandeContainer.insertBefore(div, document.getElementById("pagina-commiato"));
    });

    function aggiornaProgressBar() {
        const progressPercent = (risposteCorrette / domandePerSquadra.length) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    function mostraProssimaDomanda() {
        const activeDiv = document.querySelector(".domanda.active, .pagina.active");
        const isPagina = activeDiv.classList.contains("pagina");

        if (isPagina) {
            activeDiv.classList.remove("active");
            currentIndex++;
            localStorage.setItem('currentIndex', currentIndex);
            const nextDiv = document.querySelectorAll(".domanda, .pagina")[currentIndex];
            nextDiv.classList.add("active");
            if (nextDiv.classList.contains("domanda")) {
                timbroContainer.innerHTML = `<img src="${domandePerSquadra[currentIndex - 1].immagine}" alt="Immagine Domanda" class="bnw">`;
            } else {
                timbroContainer.innerHTML = '';
            }
        } else {
            const input = activeDiv.querySelector("input");
            const risposta = input.value.trim();
            const rispostaCorretta = domandePerSquadra[currentIndex - 1].rispostaCorretta;
            const immagine = domandePerSquadra[currentIndex - 1].immagine;

            if (risposta.toLowerCase() === rispostaCorretta.toLowerCase()) {
                const imgElement = timbroContainer.querySelector('img');
                imgElement.classList.remove('bnw');
                imgElement.classList.add('color');

                const timbro = document.createElement('div');
                timbro.className = 'timbro';
                timbroContainer.appendChild(timbro);

                timbro.style.display = 'block';

                risposteCorrette++;
                localStorage.setItem('risposteCorrette', risposteCorrette);
                aggiornaProgressBar();

                setTimeout(() => {
                    timbro.style.display = 'none';
                    activeDiv.classList.remove("active");
                    currentIndex++;
                    localStorage.setItem('currentIndex', currentIndex);
                    const nextDiv = document.querySelectorAll(".domanda, .pagina")[currentIndex];
                    nextDiv.classList.add("active");
                    if (nextDiv.classList.contains("domanda")) {
                        nextDiv.querySelector("input").focus();
                        timbroContainer.innerHTML = `<img src="${domandePerSquadra[currentIndex - 1].immagine}" alt="Immagine Domanda" class="bnw">`;
                    } else {
                        timbroContainer.innerHTML = '';
                        document.getElementById("next-button").style.display = "none";
                        localStorage.removeItem('currentIndex');
                        localStorage.removeItem('risposteCorrette');
                    }
                }, 1000);
            } else {
                alert("Risposta errata. Riprova.");
            }
        }
    }

    document.getElementById("next-button").addEventListener("click", mostraProssimaDomanda);

    document.querySelectorAll(".domanda input").forEach(input => {
        input.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                mostraProssimaDomanda();
            }
        });
    });

    function mostraDomandaCorrente() {
        const divs = document.querySelectorAll(".domanda, .pagina");
        divs.forEach(div => div.classList.remove("active"));

        const activeDiv = divs[currentIndex];
        activeDiv.classList.add("active");

        if (activeDiv.classList.contains("domanda")) {
            activeDiv.querySelector("input").focus();
            timbroContainer.innerHTML = `<img src="${domandePerSquadra[currentIndex - 1].immagine}" alt="Immagine Domanda" class="bnw">`;
        } else {
            timbroContainer.innerHTML = '';
        }
    }

    if (currentIndex > 0) {
        mostraDomandaCorrente();
    } else {
        document.querySelector(".pagina#pagina-benvenuto").classList.add("active");
    }

    aggiornaProgressBar();
});
