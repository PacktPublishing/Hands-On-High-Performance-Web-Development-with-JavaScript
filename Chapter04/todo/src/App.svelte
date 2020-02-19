<script>
	import { completed, overdue } from './stores.js';
	import Todo from './Todo.svelte';

	let newTodoText = '';
	let newTodoDate = null;
	const Todos = new Set();
	let currSize = Todos.size;

	function addTodo() {
		const todo = new Todo({
			target: document.querySelector('#main'),
			props: {
				num : Todos.size + 1,
				dueDate : newTodoDate,
				description : newTodoText
			}
		});
		newTodoText = '';
		newTodoDate = null;
		
		todo.$on('remove', () => {
			Todos.delete(todo);
			currSize = Todos.size;
			todo.$destroy();
		})
		Todos.add(todo);
		currSize = Todos.size;
	}
</script>

<style>
	
</style>

<h1>Todo Application! <span>Current number of Todos: {currSize}</span></h1>
<ul id="main">
</ul>
<button on:click={addTodo}>Add Todo</button>
<input type="text" bind:value={newTodoText} />
<input type="date" bind:value={newTodoDate} />
<br/>
<label><input type="checkbox" bind:checked={$completed}/>Completed</label>
<label><input type="checkbox" bind:checked={$overdue}/>Overdue</label> 