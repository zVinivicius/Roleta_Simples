// Selecione o botão de gatilho e o pop-up da roleta
const abrirRoletaBtn = document.getElementById('abrir-roleta');
const roletaPopup = document.getElementById('roleta-popup');
const fecharRoletaBtn = document.getElementById('fechar-roleta');

// Função para mostrar o pop-up da roleta
function mostrarRoletaPopup() {
  roletaPopup.style.display = 'block';
}

// Função para ocultar o pop-up da roleta
function ocultarRoletaPopup() {
  roletaPopup.style.display = 'none';
}

// Adicione evento de click para mostrar o pop-up
abrirRoletaBtn.addEventListener('click', mostrarRoletaPopup);

// Adicione evento de click para fechar o pop-up
fecharRoletaBtn.addEventListener('click', ocultarRoletaPopup);

// Configurações da Roleta
const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spin-btn');
const finalValue = document.getElementById('final-value');

// **Objeto de Configuração (Backend) com Porcentagens**
const cuponsConfig = {
    "CUPOM10": { desconto: "10% off", cor: "#7C3AF4", porcentagem: 10 },
    "DES15": { desconto: "15% de desconto", cor: "#46434B", porcentagem: 15 },
    "COMPREMAIS": { desconto: "20% off na próxima compra", cor: "#7C3AF4", porcentagem: 20},
    "SUPERSPAR": { desconto: "5% off em todas as compras de hoje", cor: "#46434B", porcentagem: 20 },
    "NOVOCLIENTE": { desconto: "25% de desconto para novos clientes", cor: "#7C3AF4", porcentagem: 10 }, 
    "OUTRO10": { desconto: "10% off em outro produto", cor: "#46434B", porcentagem: 20 }, 
};

// Array de cupons sem porcentagens visíveis
const cupons = Object.keys(cuponsConfig).map(nome => ({ nome, desconto: cuponsConfig[nome].desconto, cor: cuponsConfig[nome].cor }));

// Configurações do Canvas
const ctx = wheel.getContext('2d');
wheel.width = 400;
wheel.height = 400;

// Função para desenhar a roleta com segmentos de tamanho igual
function drawWheel() {
    ctx.clearRect(0, 0, wheel.width, wheel.height);
    const anguloPorCupom = (2 * Math.PI) / cupons.length; 
    let anguloInicial = 0;

    Object.keys(cuponsConfig).forEach((nome, indice) => {
        ctx.beginPath();
        ctx.arc(wheel.width / 2, wheel.height / 2, wheel.width / 2 - 20, anguloInicial, anguloInicial + anguloPorCupom);
        ctx.lineTo(wheel.width / 2, wheel.height / 2);
        ctx.closePath();
        ctx.fillStyle = cuponsConfig[nome].cor;
        ctx.fill();

        // **Modificação para texto vertical**
        ctx.font = '14px Arial'; // Reduzido para caber na vertical
        ctx.textAlign = 'center';
        ctx.textBaseline ='middle';
        const x = wheel.width / 2 + (wheel.width / 2 - 70) * Math.cos(anguloInicial + anguloPorCupom / 2);
        const y = wheel.height / 2 + (wheel.height / 2 - 70) * Math.sin(anguloInicial + anguloPorCupom / 2);
        
        // **Desenhar texto verticalmente**
        ctx.save(); // Salvar o contexto atual
        ctx.translate(x, y); // Mover a origem para o ponto desejado
        ctx.rotate(anguloInicial + anguloPorCupom / 2 + Math.PI/2); // Rotacionar para vertical
        ctx.fillStyle = '#000';
        ctx.fillText(nome, 0, 0); // Desenhar o texto na nova origem
        ctx.restore(); // Restaurar o contexto original

        anguloInicial += anguloPorCupom;
    });
}

// Desenhar a roleta inicialmente
drawWheel();

// Código para girar a roleta e exibir o resultado
let giroRealizado = false; 
spinBtn.addEventListener('click', () => {
    if (!giroRealizado) { 
        const totalPorcentagem = Object.values(cuponsConfig).reduce((acc, curr) => acc + curr.porcentagem, 0);
        const giroAleatorio = Math.floor(Math.random() * totalPorcentagem);
        let acumulado = 0;
        let indiceVencedor;

        Object.values(cuponsConfig).forEach((cupom, indice) => {
            if (acumulado <= giroAleatorio && giroAleatorio < acumulado + cupom.porcentagem) {
                indiceVencedor = indice;
            }
            acumulado += cupom.porcentagem;
        });

        // Calcular o ângulo de rotação para o vencedor ficar no meio do topo
        const anguloPorCupom = (360 / Object.keys(cuponsConfig).length);
        const anguloVencedor = (anguloPorCupom * indiceVencedor); 
        const offset = Math.floor(Math.random() * 10) - 5; 
        const voltasMinimas = 4; // Definir o mínimo de voltas
        const anguloGiro = (voltasMinimas * 360) + (260 - (anguloVencedor + (anguloPorCupom / 2))) + offset; // Giro completo mais o ângulo para o vencedor + ajuste para o topo

        // Animação de rotação
        wheel.style.transition = 'transform 5s ease-out'; 
        wheel.style.transform = `rotate(${anguloGiro}deg)`;

        // Mostrar resultado após a animação de rotação
        setTimeout(() => {
            const vencedor = Object.keys(cuponsConfig)[indiceVencedor];
            finalValue.textContent = `Você ganhou: ${vencedor} - ${cuponsConfig[vencedor].desconto}`;
            finalValue.style.visibility = 'visible';
            finalValue.style.opacity = '1';

            giroRealizado = true; 
            spinBtn.disabled = true; 
            spinBtn.textContent = 'Giro Realizado!'; 
        }, 5000); // tempo para aparecer o resultado
    }
});