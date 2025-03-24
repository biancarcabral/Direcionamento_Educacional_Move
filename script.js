const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector(".finish span");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");

import questions from "./questions.js";

// Variáveis do questionário
let currentIndex = 0;
let questionsCorrect = 0;
let responses = [];

// Contabiliza as respostas de cada curso
let courseCount = {};
// Contabiliza as respostas de cada profile
let profileCount = {};

// Variável de controle para rastrear se as perguntas de feedback foram adicionadas
let feedbackQuestionsAdded = false;

//contagem das questões à medida que avança
function nextQuestion(e) {
    const course = e.target.getAttribute("data-course");
    const profile = e.target.getAttribute("data-profile");

    if (course !== undefined && course !== null) {
        console.log("Curso escolhido:", course);

        // Adiciona a resposta ao array de respostas
        responses.push(course);

        // Aumento da contagem do curso
        courseCount[course] = (courseCount[course] || 0) + 1;
    }

    if (profile !== undefined && profile !== null) {
        console.log("Profile escolhido:", profile);

        // Aumento da contagem do profile
        profileCount[profile] = (profileCount[profile] || 0) + 1;
    }

    if (currentIndex < questions.length - 1) {
        currentIndex++;
        loadQuestion();
    } else {
        finish();  // Chama a função finish após a última pergunta
    }
}

// Função para calcular e exibir os cursos mais escolhidos
function finish() {
    // Esconde o conteúdo das perguntas e mostra o conteúdo de resultados
    content.style.display = 'none';      // Esconde a seção de perguntas
    contentFinish.style.display = 'block';  // Mostra a seção de resultados

    // Calcula o total de respostas (quantidade total de respostas do usuário)
    let totalResponses = responses.length;

    // Ordena os cursos pela quantidade de respostas
    let sortedCourses = Object.entries(courseCount).sort((a, b) => b[1] - a[1]);

    // Exibe o resultado final
    textFinish.innerHTML = "Seu ranking de preferência de acordo com o teste:<br><br>";  // Mensagem de introdução

    // Exibe os 3 cursos mais escolhidos com porcentagem
    sortedCourses.slice(0, 3).forEach(([course, count], index) => {
        let percentage = ((count / totalResponses) * 100).toFixed(2);  // Porcentagem calculada corretamente
        textFinish.innerHTML += `${index + 1}. ${course}: ${count} respostas (${percentage}%)<br>`;
    });

    // Encontra o profile mais escolhido
    let mostChosenProfile = "";
    let maxProfileCount = 0;
    for (const profile in profileCount) {
        if (profileCount[profile] > maxProfileCount) {
            maxProfileCount = profileCount[profile];
            mostChosenProfile = profile;
        }
    }

    // Exibe a mensagem do profile
    if (mostChosenProfile) {
        let profileMessage = "";
        switch (mostChosenProfile) {
            case "Dominância":
                profileMessage = "Segundo suas respostas, o seu perfil é DOMINANTE:<br> Você é direto, decidido e focado em resultados. Gosta de desafios, assume a liderança naturalmente e toma decisões rápidas. Não tem medo de correr riscos e prefere agir do que perder tempo com detalhes. Às vezes, pode parecer impaciente ou autoritário, mas seu objetivo é eficiência e progresso.";
                break;
            case "Influência":
                profileMessage = "Segundo suas respostas, o seu perfil é INFLUENTE:<br> Você é comunicativo, entusiasmado e adora interagir com as pessoas. Consegue motivar e persuadir com facilidade, sempre trazendo energia para o ambiente. Valoriza conexões e reconhecimento, buscando criar um impacto positivo. No entanto, pode se distrair facilmente e precisar de mais foco na execução.";
                break;
            case "Estabilidade":
                profileMessage = "Segundo suas respostas, o seu perfil é ESTÁVEL:<br> Você é paciente, confiável e preza pela harmonia nos relacionamentos. Gosta de ambientes previsíveis e seguros, sendo um grande apoiador das pessoas ao seu redor. Sua lealdade e empatia fazem de você alguém fácil de se confiar. No entanto, pode ter dificuldade em lidar com mudanças ou conflitos diretos.";
                break;
            case "Conformidade":
                profileMessage = "Segundo suas respostas, o seu perfil é CONFORME:<br> Você é analítico, detalhista e sempre busca a precisão em tudo o que faz. Prefere seguir regras e trabalhar com lógica, garantindo que tudo esteja correto e bem estruturado. Seu alto padrão de qualidade faz de você alguém confiável para tarefas que exigem cuidado. Porém, pode ser mais cauteloso e evitar riscos desnecessários.";
                break;
        }
        textFinish.innerHTML += `<br><br>${profileMessage}`;
    }
    // Verifica se as perguntas de feedback já existem antes de adicionar
    if (!document.getElementById("feedback-questions")) {
      textFinish.innerHTML += `
        <div id="feedback-questions">
          <p>Como foi sua experiência com este questionário? Ele te ajudou a conhecer mais sobre você e a decidir o curso para começar na nossa escola?</p>
          <textarea id="feedback-question1" rows="4" cols="50"></textarea>

          <p>Acredita que o resultado de perfil bate com a realidade?</p>
          <textarea id="feedback-question2" rows="4" cols="50"></textarea>
        </div>
      `;
    }

    // Adiciona as perguntas de feedback apenas uma vez
    if (!feedbackQuestionsAdded) {
        textFinish.innerHTML += `
      <div id="feedback-questions">
        <p><br>Como foi sua experiência com este questionário? Ele te ajudou a conhecer mais sobre você e a decidir o curso para começar na nossa escola?</p>
        <textarea id="feedback-question1" rows="4" cols="50"></textarea>

        <p>Acredita que o resultado de perfil bate com a realidade?</p>
        <textarea id="feedback-question2" rows="4" cols="50"></textarea>
      </div>
    `;
        feedbackQuestionsAdded = true; // Marca que as perguntas foram adicionadas
    }

    // Adiciona o evento de clique ao botão "ENVIAR RESPOSTAS"
    const enviarRespostasButton = document.getElementById("enviar-respostas");
    if (enviarRespostasButton) {
      enviarRespostasButton.addEventListener("click", () => {
          const resposta1 = document.getElementById("feedback-question1").value;
          const resposta2 = document.getElementById("feedback-question2").value;
          alert("RESPOSTAS ENVIADAS!"); // Exibe o alerta
          console.log("Respostas enviadas:", resposta1, resposta2);
          // Aqui você pode adicionar a lógica para enviar as respostas para um servidor
        });
    }


    // Desabilita os botões de resposta para evitar múltiplos cliques
    document.querySelectorAll(".answer").forEach((item) => {
        item.disabled = true;
    });
}

// Função para carregar e exibir a nova pergunta no questionário
function loadQuestion() {
    spnQtd.innerHTML = `${currentIndex + 1}/${questions.length}`;
    const item = questions[currentIndex];
    answers.innerHTML = "";
    question.innerHTML = item.question;

    item.answers.forEach((answer) => {
        const div = document.createElement("div");
        const button = document.createElement("button");
        button.classList.add("answer");
        button.textContent = answer.option;

        if (answer.course) {
            button.setAttribute("data-course", answer.course);
        }
        if (answer.profile) {
            button.setAttribute("data-profile", answer.profile);
        }

        div.appendChild(button);
        answers.appendChild(div);
    });
}

// Inicia o questionário
loadQuestion();

answers.addEventListener("click", function (event) {
    if (event.target.classList.contains("answer")) {
        nextQuestion(event);
    }
})