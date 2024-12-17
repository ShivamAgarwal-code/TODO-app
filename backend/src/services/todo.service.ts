import { AppDataSource } from "../db";
import { TodoEntity } from "../entities/todo.entity";

// Define a type for a Todo without certain properties
type Todo = Omit<TodoEntity, "user" | "createdAt" | "updatedAt" | "deletedAt">;

/**
 * Creates a new todo item for a user.
 * 
 * @param id - The UUID of the user.
 * @param data - The data for the todo, excluding the UUID.
 * @returns The newly created todo item.
 */
export const createTodo = async (id: string, data: Omit<Todo, "uuid">) => {
  const { title, description, status, dueDate } = data;
  const todoRepository = AppDataSource.getRepository(TodoEntity);
  const todo = todoRepository.create({ title, description, status, dueDate, user: { uuid: id } });
  await todoRepository.save(todo);
  return todo;
};

/**
 * Updates an existing todo item.
 * 
 * @param id - The UUID of the user.
 * @param uuid - The UUID of the todo item.
 * @param data - A partial data update for the todo.
 * @returns The updated todo item, or null if not found.
 */
export const updateTodo = async (id: string, data: Partial<Todo>) => {
  const todoRepository = AppDataSource.getRepository(TodoEntity);
  const findTodo = await todoRepository.findOne({ where: { uuid: data.uuid, user: { uuid: id } } });
  if (!findTodo) return null;
  const todo = todoRepository.merge(findTodo, data);
  await todoRepository.update({ uuid: data?.uuid }, todo);
  return todo;
};

/**
 * Deletes a specified todo item.
 * 
 * @param id - The UUID of the user.
 * @param uuid - The UUID of the todo item.
 * @returns True if the todo was deleted, or null if not found.
 */
export const deleteTodo = async (id: string, uuid: string) => {
  const todoRepository = AppDataSource.getRepository(TodoEntity);
  const findTodo = await todoRepository.findOne({ where: { uuid, user: { uuid: id } } });
  if (!findTodo) return null;
  await todoRepository.remove(findTodo);
  return true;
};

/**
 * Retrieves a single todo item.
 * 
 * @param id - The UUID of the user.
 * @param uuid - The UUID of the todo item.
 * @returns The found todo item, or null if not found.
 */
export const getOneTodo = async (id: string, uuid: string) => {
  const todoRepository = AppDataSource.getRepository(TodoEntity);
  const findTodo = await todoRepository.findOne({ where: { uuid, user: { uuid: id } } });
  if (!findTodo) return null;
  return findTodo;
};

/**
 * Retrieves all todo items for a given user.
 * 
 * @param user_uuid - The UUID of the user.
 * @returns An array of todos belonging to the user.
 */
export const getAllTodo = async (user_uuid: string) => {
  const todoRepository = AppDataSource.getRepository(TodoEntity);
  const findTodo = await todoRepository.find({ where: { user: { uuid: user_uuid } } });
  return findTodo;
};
