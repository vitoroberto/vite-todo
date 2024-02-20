import { useEffect, useState } from "react";
import Rocket from "./components/Rocket";
import Clipboard from "./components/Clipboard";
import Vector from "./components/Vector";
import Trash from "./components/Trash";

type TodoTask = {
  id: number;
  text: string;
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");

  const createTodoTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim() === "") {
      return;
    }

    const newTask: TodoTask = {
      id: Date.now(),
      text: newTaskTitle,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);

    localStorage.setItem("todoTasks", JSON.stringify([...tasks, newTask]));

    setNewTaskTitle("");
  };

  const deleteTodoTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    localStorage.setItem("todoTasks", JSON.stringify(updatedTasks));
  };

  const toggleCompleted = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task,
    );
    localStorage.setItem("todoTasks", JSON.stringify(updatedTasks));
  };

  useEffect(() => {
    const existingTasksJSON = localStorage.getItem("todoTasks");
    const existingTasks: TodoTask[] = existingTasksJSON
      ? JSON.parse(existingTasksJSON)
      : [];
    setTasks(existingTasks);
  }, []);

  return (
    <div className="flex h-screen w-screen max-w-5xl flex-col items-center">
      <div className="grid h-36 w-screen items-center justify-center bg-[#0D0D0D] sm:h-[200px]">
        <a
          href="/"
          className="flex items-center group-first:hover:text-[#5E60CE]"
        >
          <Rocket />
          <h1 className="ml-2 text-[40px] font-bold text-[#4EA8DE]">
            to<span className="text-[#5E60CE]">do</span>
          </h1>
        </a>
      </div>
      <main className="absolute top-[115px] w-full max-w-[736px] px-4 sm:top-[170px]">
        <div className="mb-16">
          <form
            onSubmit={(e) => createTodoTask(e)}
            className="grid gap-2 sm:grid-cols-6"
          >
            <input
              className="w-full rounded-lg border border-solid border-[#0D0D0D] bg-[#262626] p-4 text-zinc-100 placeholder:text-[#808080] focus:border-[#4EA8DE] focus:outline-none sm:col-span-5"
              onChange={(e) => setNewTaskTitle(e.target.value)}
              value={newTaskTitle}
              type="text"
              placeholder="Adicione uma nova tarefa"
              required
            />
            <button
              className="w-full rounded-lg bg-[#1E6F9F] p-2 font-bold text-white transition duration-300 hover:bg-[#5E60CE]"
              type="submit"
            >
              Criar
            </button>
          </form>
        </div>
        <div className="mb-6">
          <div className="flex flex-row justify-between">
            <p className="font-bold text-[#4EA8DE]">
              Tarefas criadas
              <span className="ml-2 rounded-full bg-[#333] px-2 py-[2px] text-xs font-bold text-zinc-100">
                {tasks.length}
              </span>
            </p>
            <p className="font-bold text-[#8284FA]">
              Concluídas
              <span className="ml-2 rounded-full bg-[#333] px-2 py-[2px] text-xs font-bold text-zinc-100">
                {`${tasks.filter((task) => task.completed).length} de ${tasks.length}`}
              </span>
            </p>
          </div>
        </div>
        <div className="grid gap-3 pb-4">
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center border-t-2 border-[#333] text-white">
              <div className="mb-5 mt-16 h-[56px] w-[56px]">
                <Clipboard />
              </div>
              <div className="text-base text-[#808080]">
                <p className="font-bold">
                  Você ainda não tem tarefas cadastradas
                </p>
                <p className="text-center">
                  Crie tarefas e organize seus itens a fazer
                </p>
              </div>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="grid h-full min-h-[72px] grid-cols-6 rounded-lg border border-[#333] bg-[#262626] text-sm text-zinc-100 shadow-[0_2px_8px_0px_rgba(0,0,0,0.6)]"
              >
                <div
                  className="col-span-5 mr-2 flex cursor-pointer items-center"
                  onClick={() => toggleCompleted(task.id)}
                >
                  <div className="mx-2">
                    {task.completed ? (
                      <span className="inline-block h-6 w-6 rounded-[50%] border-2 border-[#5E60CE] bg-[#5E60CE]">
                        <Vector />
                      </span>
                    ) : (
                      <span className="inline-block h-6 w-6 rounded-[50%] border-2 border-[#4EA8DE]"></span>
                    )}
                  </div>
                  <div className="max-w-[200px] break-words py-5 text-left sm:max-w-full">
                    <p>{task.text}</p>
                  </div>
                </div>
                <button
                  className="flex items-center justify-center border-l-2 border-[#333]"
                  onClick={() => deleteTodoTask(task.id)}
                >
                  <Trash />
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
