import { Todo } from "#/lib/models";

export class TodoService {
	async list() {
		const data = await Todo.find().sort({ createdAt: -1 }).lean();
		return data.map((d) => ({ ...d, id: d._id.toString() }));
	}

	async create(title: string) {
		const newTodo = await Todo.create({ title });
		return { ...newTodo.toJSON(), id: newTodo._id.toString() };
	}
}
