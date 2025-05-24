"use client";
import React from "react";
import './addworkout.css';
import { toast } from "react-toastify";

interface Workout {
  name: string;
  description: string;
  durationInMinutes: number;
  exercises: Exercise[];
  imageURL: string;
  imageFile: File | null;
}

interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: number;
  imageURL: string;
  imageFile: File | null;
}

const Page: React.FC = () => {
  const [workout, setWorkout] = React.useState<Workout>({
    name: "",
    description: "",
    durationInMinutes: 0,
    exercises: [],
    imageURL: "",
    imageFile: null,
  });

  const [exercise, setExercise] = React.useState<Exercise>({
    name: "",
    description: "",
    sets: 0,
    reps: 0,
    imageURL: "",
    imageFile: null,
  });

  const handleWorkoutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkout({
      ...workout,
      [e.target.name]: e.target.value,
    });
  };

  const handleExerciseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExercise({
      ...exercise,
      [e.target.name]: e.target.value,
    });
  };

  const addExerciseToWorkout = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (
      exercise.name === "" ||
      exercise.description === "" ||
      exercise.sets === 0 ||
      exercise.reps === 0 ||
      exercise.imageFile === null
    ) {
      toast.error("Please fill all the fields", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: [...prevWorkout.exercises, exercise],
    }));

    setExercise({
      name: "",
      description: "",
      sets: 0,
      reps: 0,
      imageURL: "",
      imageFile: null,
    });
  };

  const deleteExerciseFromWorkout = (index: number) => {
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: prevWorkout.exercises.filter((_, i) => i !== index),
    }));
  };

  const uploadImage = async (image: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("myimage", image);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/image-upload/uploadimage`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.imageUrl;
    } else {
      console.error("Failed to upload the image.");
      return null;
    }
  };

  const checkLogin = async () => {
    try {
      console.log("Backend URL:", process.env.NEXT_PUBLIC_BACKEND_API);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API}/admin/checklogin`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
  
      if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        window.location.href = "/adminauth/login";
      } else {
        console.log("Admin is authenticated");
      }
    } catch (error) {
      console.error("Error checking login:", error);
      window.location.href = "/adminauth/login";
    }
  };
  

  const saveWorkout = async () => {
    await checkLogin();

    if (
      workout.name === "" ||
      workout.description === "" ||
      workout.durationInMinutes === 0 ||
      workout.imageFile === null ||
      workout.exercises.length === 0
    ) {
      toast.error("Please fill all the fields", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (workout.imageFile) {
      const imageURL = await uploadImage(workout.imageFile);
      if (imageURL) {
        setWorkout((prevWorkout) => ({
          ...prevWorkout,
          imageURL,
        }));
      }
    }

    for (const ex of workout.exercises) {
      if (ex.imageFile) {
        const imgURL = await uploadImage(ex.imageFile);
        if (imgURL) {
          ex.imageURL = imgURL;
        }
      }
    }
    console.log(workout)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API}/workoutplans/workouts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workout),
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      toast.success("Workout created successfully", {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      console.error("Workout creation failed");
      toast.error("Workout creation failed", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <div className="formpage">
      <h1 className="title">Add Workout</h1>
      <input
        type="text"
        placeholder="Workout Name"
        name="name"
        value={workout.name}
        onChange={handleWorkoutChange}
      />
      <textarea
        placeholder="Workout Description"
        name="description"
        value={workout.description}
        onChange={(e) =>
          setWorkout({ ...workout, description: e.target.value })
        }
        rows={5}
        cols={50}
      />
      <label htmlFor="durationInMinutes">Duration in Minutes</label>
      <input
        type="number"
        placeholder="Workout Duration"
        name="durationInMinutes"
        value={workout.durationInMinutes}
        onChange={handleWorkoutChange}
      />
      <input
        type="file"
        placeholder="Workout Image"
        name="workoutImage"
        onChange={(e) =>
          setWorkout({ ...workout, imageFile: e.target.files?.[0] || null })
        }
      />
      <div>
        <h2 className="title">Add Exercise to workout</h2>
        <input
          type="text"
          placeholder="Exercise Name"
          name="name"
          value={exercise.name}
          onChange={handleExerciseChange}
        />
        <textarea
          placeholder="Exercise Description"
          name="description"
          value={exercise.description}
          onChange={(e) =>
            setExercise({ ...exercise, description: e.target.value })
          }
          rows={5}
          cols={50}
        />
        <label htmlFor="sets">Sets</label>
        <input
          type="number"
          placeholder="Sets"
          name="sets"
          value={exercise.sets}
          onChange={handleExerciseChange}
        />
        <label htmlFor="reps">Reps</label>
        <input
          type="number"
          placeholder="Reps"
          name="reps"
          value={exercise.reps}
          onChange={handleExerciseChange}
        />
        <input
          type="file"
          placeholder="Exercise Image"
          name="exerciseImage"
          onChange={(e) =>
            setExercise({
              ...exercise,
              imageFile: e.target.files?.[0] || null,
            })
          }
        />
        <button onClick={addExerciseToWorkout}>Add Exercise</button>
      </div>

      <div className="exercises">
        <h1 className="title">Exercises</h1>
        {workout.exercises.map((exercise, index) => (
          <div className="exercise" key={index}>
            <h2>{exercise.name}</h2>
            <p>{exercise.description}</p>
            <p>Sets: {exercise.sets}</p>
            <p>Reps: {exercise.reps}</p>
            <img
              src={
                exercise.imageFile
                  ? URL.createObjectURL(exercise.imageFile)
                  : exercise.imageURL
              }
              alt=""
            />
            <button onClick={() => deleteExerciseFromWorkout(index)}>
              Delete
            </button>
          </div>
        ))}
      </div>

      <button onClick={saveWorkout}>Add Workout</button>
    </div>
  );
};

export default Page;
