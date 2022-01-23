let input = document.getElementById('inputText');
let list = document.getElementById('list');
let createBtn = document.getElementById('applyBtn');

class TodoList {
  constructor(el) {
    this.el = el;
    this.el.addEventListener('click', (event) => {
      let target = event.target;
      let id = target.closest('li').dataset.id;
      if (target.classList.contains('set-status')) {
        createLi.changeStatus(id);
      } else if (target.classList.contains('delete-task')) {
        createLi.removeTodo(id);
      }
    })
  }
  async getData() {
    try {
      return await $.ajax({
        url: 'http://localhost:3000/todos',
        dataType: "json",
        type: "GET"
      });
    } catch (error) {
      console.log(new Error(error));
    }
  }

  async render() {
    let lis = '';
    try {
      let data = await this.getData();
      for (let el of data) {
        if (!el) {
          return;
        }
        let colorToDo = el.complited ? "green" : "yellow";
        lis += `<li data-id="${el.id}" class ="${colorToDo}">${el.task}<button class="delete-task">Delete</button><button class="set-status">Change status</button></li>`;
      }
      this.el.innerHTML = lis;
    } catch (error) {
      console.log(new Error(error));
    }
  }

  async addTodo() {
    try {
      if (input.value !== '') {
        await $.ajax({
          url: 'http://localhost:3000/todos',
          type: "POST",
          dataType: "json",
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({
            task: input.value,
            complited: false,
          })
        });
        this.render()
      }

    } catch (err) {
      console.log(err);
    }
  }

  async changeStatus(id) {
    try {
      let data = await this.getData();

      for (let el of data) {
        if (el.id == id) {
          el.complited = !el.complited;
          let changeStatus = document.querySelector(`[data-id="${id}"]`);

          this.changeTodoColor(changeStatus);

          $.ajax({
            url: `http://localhost:3000/todos/${id}`,
            type: "PUT",
            dataType: "json",
            headers: {
              'Content-Type': 'application/json'
            },
            data: JSON.stringify({
              task: el.task,
              complited: el.complited,
            })
          });
        }
        this.render()
      }
    } catch (error) {
      console.log(new Error(error));
    }
  }

  changeTodoColor(el) {
    el.classList.toggle('green');
  }

  async removeTodo(id) {
    try {
      let data = await this.getData();

      for (let item of data) {
        if (item.id == id) {
          $.ajax({
            url: `http://localhost:3000/todos/${id}`,
            type: "DELETE",
            dataType: "json",
            headers: {
              'Content-Type': 'application/json'
            },
            data: null
          });
        }
        this.render()
      }
    } catch (error) {
      console.log(new Error(error));
    }
  }
}

let createLi = new TodoList(list);
createLi.render();

createBtn.addEventListener('click', function () {
  if (input.value) {
    createLi.addTodo();
    input.value = '';
  }
})