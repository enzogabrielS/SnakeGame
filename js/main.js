const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const score = document.querySelector(".score-value")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")
const finalScore = document.querySelector(".final-score")
let ativarMovimento = true
let recordeScore = document.querySelector(".score-value-best")

var audio = new Audio("../audio/comida.wav")

const size = 30;

canvas.width = 600;
canvas.height = 600;

const initialPosition = { x: 270, y: 240 }

let cobra = [initialPosition]

const pontuacao = () => {
    score.innerText = +score.innerText + 10
}

const numeroRandomico = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const posicaoRandomico = (min, max) => {
    const numero = numeroRandomico(0, canvas.width - size)
    return Math.round(numero / 30) * 30
}

const corRamdomico = () => {

    const red = numeroRandomico(0, 255)
    const green = numeroRandomico(0, 255)
    const blue = numeroRandomico(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const comida = {
    x: posicaoRandomico(),
    y: posicaoRandomico(),
    color: corRamdomico()
}
let direcao, loopid

desenharComida = () => {
    const {x, y, color} = comida

    ctx.shadowColor = color
    ctx.shadowBlur = 50
    ctx.fillStyle = color
    ctx.fillRect(comida.x, comida.y, size, size)
    ctx.shadowBlur = 0
}

desenharCobra = () => {
    ctx.fillStyle = "#ddd";

    cobra.forEach((posicao, index) => {
        if (index == cobra.length - 1) {
            ctx.fillStyle = "white"
        }
        ctx.fillRect(posicao.x, posicao.y, size, size);
    })
}

desenharLinha = (color) => {
    ctx.lineWidth = 4
    ctx.shadowColor = "violet"
    ctx.shadowBlur = 5
    ctx.strokeStyle = "white"

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

desenharLinha()

const moverCobra = () => {
    if (!direcao) return
    const cabeca = cobra[cobra.length -1]
    
    if (direcao == "right") {
        cobra.push({x: cabeca.x + size, y: cabeca.y})
    }
    if (direcao == "left") {
        cobra.push({x: cabeca.x - size, y: cabeca.y})
    }
    if (direcao == "down") {
        cobra.push({x: cabeca.x, y: cabeca.y + size})
    }
    if (direcao == "up") {
        cobra.push({x: cabeca.x, y: cabeca.y - size})
    }

    cobra.shift()
}

posComida = () => {
    let x = posicaoRandomico()
    let y = posicaoRandomico()

    while (cobra.find((posicao) => posicao.x == x && posicao.y == y)) {
        x = posicaoRandomico()
        y = posicaoRandomico()
    }
    comida.x = x
    comida.y = y
    comida.color = corRamdomico()
}

gameOver = () => {
    ativarMovimento = false;
    direcao = undefined;

    let pontuacaoFinal = Number(score.innerText);
    finalScore.innerText = pontuacaoFinal > 0 ? pontuacaoFinal : "0";

    if (pontuacaoFinal > Number(recordeScore.innerText)) {
        recordeScore.innerText = pontuacaoFinal;
    }

    menu.style.display = "flex";
    canvas.style.filter = "blur(2px)";

   
};


verificarColisao = () => {

    const cabeca = cobra[cobra.length - 1]
    const limiteCanvas = canvas.width - size
    const pescocoIndex = cobra.length - 2
    const colisaoParede = cabeca.x < 0 || cabeca.x > 570 || cabeca.y < 0 || cabeca.y > 570

    const colisaoPropria = cobra.find((posicao, index) =>{
        return index < pescocoIndex && posicao.x == cabeca.x && posicao.y == cabeca.y
    })

    if(colisaoParede || colisaoPropria){
        gameOver()

    }

}

const verificarComida = () => {
    const cabeca = cobra[cobra.length -1]

    if (cabeca.x == comida.x && cabeca.y == comida.y) {
        audio.play()
        cobra.push(cabeca)
        pontuacao()
        posComida()
    }
    
} 

const loopgame = () => {
    clearInterval(loopid)

    
    ctx.clearRect(0, 0, 600, 600)
    desenharCobra()
    desenharLinha()
    desenharComida()
    moverCobra()

    verificarComida()
    verificarColisao()

    loopid = setTimeout(() =>{
        loopgame()
    }, 100)
}

loopgame()

document.addEventListener("keydown", ({key})=>{
    if (ativarMovimento == true) {
        if (key == "d" && direcao != "left") {
            direcao = "right"
        }
        if (key == "a" && direcao != "right") {
            direcao = "left"
        }
        if (key == "w" && direcao != "down") {
            direcao = "up"
        }
        if (key == "s" && direcao != "up") {
            direcao = "down"
        }
    }
    
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"
    direcao = undefined
    cobra = [initialPosition]
    ativarMovimento = true
})