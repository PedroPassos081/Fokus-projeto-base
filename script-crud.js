const taskListContainer = document.querySelector('.app__section-task-list')

const formTask = document.querySelector('.app__form-add-task')
const toggleFormTaskBtn = document.querySelector('.app__button--add-task')
const formLabel = document.querySelector('.app__form-label')

const textarea = document.querySelector('.app__form-textarea')

const cancelFormTaskBtn = document.querySelector('.app__form-footer__button--cancel')

const taskAtiveDescription = document.querySelector('.app__section-active-task-description')

const btnCancelar = document.querySelector('.app__form-footer__button--cancel')

const localStorageTasks = localStorage.getItem('tasks')
let tasks = localStorageTasks ? JSON.parse(localStorageTasks) : []

// Recebe um caminho SVG
const taskIconSvg = `
<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
    <path
        d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z"
        fill="#01080E" />
</svg>
`

let tarefaSelecionada = null
let itemTarefaSelecionada = null

let tarefaEmEdicao = null
let paragraphEmEdicao = null

const selecionaTarefa = (tarefa, elemento) => {
   if(tarefa.concluida){
    return
   } 

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active')
    })

    if (tarefaSelecionada == tarefa) {
        taskAtiveDescription.textContent = null
        itemTarefaSelecionada = null
        tarefaSelecionada = null
        return
    }
    
    tarefaSelecionada = tarefa
    itemTarefaSelecionada = elemento
    taskAtiveDescription.textContent = tarefa.descricao
    elemento.classList.add('app__section-task-list-item-active')
    }

const limparForm = () => {
    tarefaEmEdicao = null
    paragraphEmEdicao = null
    textarea.value = ''
    formTask.classList.add('hidden')
}

// Função para editar as tarefas
const selecionaTarefaParaEditar = (tarefa, elemento) => {
 if(tarefaEmEdicao == tarefa) {
    limparForm()
    return
 }

 formLabel.textContent='Editando tarefa'
 tarefaEmEdicao = tarefa
 paragraphEmEdicao = elemento
 textarea.value = tarefa.descricao
 formTask.classList.remove('hidden')
}

// Função que cria tarefa e joga no HTML
function createTask(tarefa) {
    const li = document.createElement('li')
    li.classList.add('app__section-task-list-item')

    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML = taskIconSvg

    const paragraph = document.createElement('p')
    paragraph.classList.add('app__section-task-list-item-description')

    paragraph.textContent = tarefa.descricao

    const button = document.createElement('button')

    button.classList.add('app_button-edit')
    const editIcon = document.createElement('img')
    editIcon.setAttribute('src', '/imagens/edit.png')
    
    button.appendChild(editIcon)

    button.addEventListener('click', (event) => {
        event.stopPropagation()
        selecionaTarefaParaEditar(tarefa, paragraph)
    })

    li.onclick = () => {
        selecionaTarefa(tarefa, li)
    }

    svgIcon.addEventListener('click', (event) => {
        // Marcando as tarefas como concluida no localStorage 
        if(tarefa == tarefaSelecionada) {
            event.stopPropagation()
            button.setAttribute('disabled', true)
            li.classList.add('app__section-task-list-item-complete')
            tarefaSelecionada.concluida = true
            
            updateLocalStorage()
        }
       
    })

    if(tarefa.concluida) {
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    }

    li.appendChild(svgIcon)
    li.appendChild(paragraph)
    li.appendChild(button)

    return li
}

// Faz com que apareça a tarefa na tela
tasks.forEach(task => {
    const taskItem = createTask(task)
    taskListContainer.appendChild(taskItem)
})

// função para abrir uma tarefa nova 
toggleFormTaskBtn.addEventListener('click', () => {
    formLabel.textContent = 'Adicionando tarefa'
    formTask.classList.toggle('hidden')
})

// transforma um objeto javascript em uma string para o localStorage
const updateLocalStorage = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

// função para cancelar a tarefa 
cancelFormTaskBtn.addEventListener('click', () => {
    formTask.classList.add('hidden')

    limparForm()
})

// função para adicionar tarefa e editar tarefa
formTask.addEventListener('submit', (evento) => {
    evento.preventDefault()
    
    if(tarefaEmEdicao) {
        tarefaEmEdicao.descricao = textarea.value
        paragraphEmEdicao.textContent = textarea.value
    } else {
    const task = {
        descricao: textarea.value,
        concluida: false
    }
    tasks.push(task)
    const taskItem = createTask(task)
    taskListContainer.appendChild(taskItem)
    }
    updateLocalStorage()
    limparForm()
})

document.addEventListener('TarefaFinalizada', (e) => {
    if(tarefaSelecionada) {
        tarefaSelecionada.concluida = true
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true)
       
        updateLocalStorage()
    }
})
 