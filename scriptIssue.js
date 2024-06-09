document.addEventListener("DOMContentLoaded", function() {
    const domande = [
        { domanda: "Indicazioni tappa 1: ...", rispostaCorretta: "risposta1", immagine: "immagini/immagine1.png" },
        { domanda: "Indicazioni tappa 2: ...", rispostaCorretta: "risposta2", immagine: "immagini/immagine2.png" },
        { domanda: "Indicazioni tappa 3: ...", rispostaCorretta: "risposta3", immagine: "immagini/immagine3.png" },
        { domanda: "Indicazioni tappa 4: ...", rispostaCorretta: "risposta4", immagine: "immagini/immagine4.png" },
        { domanda: "Indicazioni tappa 5: ...", rispostaCorretta: "risposta5", immagine: "immagini/immagine5.png" },
        { domanda: "Indicazioni tappa 6: ...", rispostaCorretta: "risposta6", immagine: "immagini/immagine6.png" },
        { domanda: "Indicazioni tappa 7: ...", rispostaCorretta: "risposta7", immagine: "immagini/immagine7.png" },
        { domanda: "Indicazioni tappa 8: ...", rispostaCorretta: "risposta8", immagine: "immagini/immagine8.png" },
        { domanda: "Indicazioni tappa 9: ...", rispostaCorretta: "risposta9", immagine: "immagini/immagine9.png" },
        { domanda: "Indicazioni tappa 10: ...", rispostaCorretta: "risposta10", immagine: "immagini/immagine10.png" }
    ];

    const squadra = parseInt(document.body.getAttribute('data-squadra'), 10);
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
