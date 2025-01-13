import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSprings, animated } from 'react-spring';
import ReactSound from 'react-sound';
import './GratitudeGarden.css';

const GratitudeGarden = () => {
  const [gratitudePlants, setGratitudePlants] = useState([]);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [newGratitude, setNewGratitude] = useState('');
  const [dayCounter, setDayCounter] = useState(1); // Track the day of the process

  // Handles dragging logic
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(gratitudePlants);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setGratitudePlants(items);
  };

  // Adds new gratitude plant to the garden
  const addGratitude = (gratitude) => {
    setGratitudePlants((prevPlants) => [
      ...prevPlants,
      {
        id: Date.now(),
        text: gratitude,
        growthStage: 1,
        journalEntry: '',
        timestamp: new Date().toLocaleString(), // Adding timestamp for when the gratitude was entered
      },
    ]);
    setSoundPlaying(true); // Play sound when a new plant is added
    setNewGratitude('');
  };

  // Update the growth stage for the plant each day (1-7 days)
  const updateGrowthStage = (id) => {
    setGratitudePlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === id
          ? { ...plant, growthStage: Math.min(plant.growthStage + 1, 7) }
          : plant
      )
    );
    // Increment the day counter for the growth process
    setDayCounter((prev) => Math.min(prev + 1, 7));
  };

  // Remove a plant from the garden
  const removePlant = (id) => {
    setGratitudePlants((prevPlants) =>
      prevPlants.filter((plant) => plant.id !== id)
    );
  };

  // Update journal entry for a specific plant
  const updateJournalEntry = (id, entry) => {
    setGratitudePlants((prevPlants) =>
      prevPlants.map((plant) =>
        plant.id === id ? { ...plant, journalEntry: entry } : plant
      )
    );
  };

  // Use useSprings to handle multiple spring animations
  const springs = useSprings(
    gratitudePlants.length,
    gratitudePlants.map((plant) => ({
      transform: `scale(${1 + plant.growthStage * 0.1})`, // Plant grows with each gratitude
      opacity: 1,
      from: { opacity: 0, transform: 'scale(0.5)' },
    }))
  );

  const getPlantIcon = (growthStage) => {
    switch (growthStage) {
      case 1:
        return <img src="/stage1.png" alt="Stage 1" />; // Day 1
      case 2:
        return <img src="/stage2.png" alt="Stage 2" />; // Day 2
      case 3:
        return <img src="/stage3.png" alt="Stage 3" />; // Day 3
      case 4:
        return <img src="/stage4.png" alt="Stage 4" />; // Day 4
      case 5:
        return <img src="/stage5.png" alt="Stage 5" />; // Day 5
      case 6:
        return <img src="/stage6.png" alt="Stage 6" />; // Day 6
      case 7:
        return <img src="/stage7.png" alt="Stage 7" />; // Day 7 (Mature Plant)
      default:
        return <img src="/stage1.png" alt="Default Stage" />; // Default to stage 1 if unknown
    }
  };

  // Group plants by their growth stage (Day 1 to Day 7)
  const groupEntriesByDay = () => {
    const groupedEntries = {};
    gratitudePlants.forEach((plant) => {
      if (!groupedEntries[plant.growthStage]) {
        groupedEntries[plant.growthStage] = [];
      }
      groupedEntries[plant.growthStage].push(plant);
    });
    return groupedEntries;
  };

  return (
    <div className="garden-container">
      <h2 className="gratitude-garden-heading">
        🌿 Welcome to the Gratitude Garden 🌸
      </h2>
      <div className="layout">
        {/* Gratitude Journal (Styled as a book) */}
        <div className="gratitude-journal-container">
          <h3 className="journal-header">📖 Gratitude Journal</h3>
          <textarea
            className="journal-input"
            placeholder="Write your gratitude here..."
            value={newGratitude}
            onChange={(e) => setNewGratitude(e.target.value)}
          />
          <button
            className="add-gratitude-button"
            onClick={() => {
              if (newGratitude) {
                addGratitude(newGratitude);
              }
            }}
          >
            Add to Garden
          </button>
          <div className="journal-entries">
            <h4>🌟 Journal Entries 🌟</h4>
            {/* Render Day-wise Entries */}
            {Object.keys(groupEntriesByDay()).map((day) => (
              <div key={day} className="day-entry">
                <h5>Day {day}</h5>
                {groupEntriesByDay()[day].map((plant) => (
                  <div key={plant.id} className="journal-entry">
                    <h5>{plant.text}</h5>
                    <p>Timestamp: {plant.timestamp}</p>
                    {/* Removed the journal entry box (textarea) here */}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Garden Display */}
        <div className="garden-display">
          <ReactSound
            url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            playStatus={soundPlaying ? ReactSound.status.PLAYING : ReactSound.status.STOPPED}
            onFinishedPlaying={() => setSoundPlaying(false)}
          />

          <div className="sun"></div>

          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="garden" direction="horizontal">
              {(provided) => (
                <div
                  className="garden"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {gratitudePlants.map((plant, index) => (
                    <Draggable
                      key={plant.id}
                      draggableId={plant.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <animated.div
                          className="plant"
                          style={springs[index]} // Apply spring animation here from useSprings
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="plant-content">
                            <div className="plant-icon">
                              {getPlantIcon(plant.growthStage)}
                            </div>
                            <div className="plant-text">{plant.text}</div>
                            <div className="plant-stage">
                              Day: {plant.growthStage} of 7
                            </div>
                            <div className="plant-actions">
                              <button onClick={() => updateGrowthStage(plant.id)}>
                                Fertilize (Next Day)
                              </button>
                              <button onClick={() => removePlant(plant.id)}>
                                Remove
                              </button>
                            </div>
                          </div>
                        </animated.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <div className="ground">
        <span className="tree">🌳</span>
        <span className="tree">🌳</span>
        <span className="flower">🌷</span>
        <span className="flower">🌿</span>
        <span className="flower">🌿</span>
      </div>
    </div>
  );
};

export default GratitudeGarden;
