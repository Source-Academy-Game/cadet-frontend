import { storyXMLPathTest, storyXMLPathLive } from '../constants/constants'
import { isStudent } from './user';

var SaveManager = require('../save-manager/save-manager.js');

/**
 * Handles data regarding the game state. 
 * - The student's list of completed quests and collectibles
 * - The student's current story mission
 * - The global list of missions that are open
 */
let fetched = false;
let studentMissionPointer = undefined,
    studentData = undefined;
export function fetchGameData(userStory, callback) {
  // fetch only needs to be called once; if there are additional calls somehow then ignore them
  if(fetched) {
    callback();
    return;
  }
  fetched = true;
  studentData = userStory;
  studentMissionPointer = studentData.missionPointer;
  fetchGlobalMissionPointer(callback);
}

// overrides
let studentDataOverride = undefined,
    missionPointerOverride = undefined,
    currentDateOverride = undefined;
    
// override student game data
export function overrideStudentData(data) { studentDataOverride = data; }
// override student's current mission
export function overrideMissionPointer(data) { missionPointerOverride = data; }
// override current date (to determine active missions)
export function overrideCurrentDate(data) { currentDateOverride = data; }


let handleSaveData = undefined;

export function setSaveHandler(saveData) { 
  console.log("saved!");
  handleSaveData = saveData; 
}

export function getStudentData() {
  // formerly create-initializer/loadFromServer
  if(studentDataOverride) return studentDataOverride;
  return studentData;
}

export function saveStudentData(data) {
  console.log('saving student data');
  if (handleSaveData !== undefined) {
    handleSaveData(data)
  }
}

export function saveCollectible(collectible) {
  // currently local but we should eventually migrate to backend
  if (typeof Storage !== 'undefined') {
    localStorage.setItem(collectible, 'collected');
  }
  saveStudentData()
}

export function saveQuest(questId) {
  // currently local but we should eventually migrate to backend
  console.log(localStorage.getItem(questId));
  // if (typeof Storage !== 'undefined') {
  //   localStorage.setItem(questId, 'completed');
  // }
  studentData["completed_quests"]["questId"] = 'completed';
  console.log(studentData);
  saveStudentData(data);
  
}

function getStudentMissionPointer() {
  // placeholder
  if(missionPointerOverride) return missionPointerOverride;
  return studentMissionPointer;
}

let stories = [];

function fetchGlobalMissionPointer(callback) {
  const makeAjax = isTest => $.ajax({
    type: 'GET',
    url: (isTest ? storyXMLPathTest : storyXMLPathLive) + 'master.xml',
    dataType: 'xml',
    success: xml => {
      stories = Array.from(xml.children[0].children);
      stories = stories.sort((a, b) => parseInt(a.getAttribute("key")) - parseInt(b.getAttribute("key")));
      const now = currentDateOverride ? currentDateOverride : new Date();
      const openStory = story => new Date(story.getAttribute("startDate")) < now && now < new Date(story.getAttribute("endDate"));
      stories = stories.filter(openStory);
      callback();
    },
    error: isTest
      ? () => {
          console.log('Cannot find master story list on test');
          console.log('Trying on live...');
          makeAjax(false);
        }
      : () => {
          console.error('Cannot find master story list');
        }
  });
  makeAjax(!isStudent());
}

/**
 * Obtain the story mission to load. This will usually be the student's current mission pointer.
 * However, in the event the student's current mission pointer falls outside the bounds of the
 * global list of open missions, then the corresponding upper (or lower) bound will be used.
 */
export function getMissionPointer() {
  let student = getStudentMissionPointer();
  const newest = parseInt(stories[stories.length-1].getAttribute("key")); // the newest mission to open
  const oldest = parseInt(stories[0].getAttribute("key")); // the oldest mission to open
  student = Math.min(student, newest);
  student = Math.max(student, oldest);
  const storyToLoad = stories.filter(story => story.getAttribute("key") == student)[0];
  console.log("Now loading story " + storyToLoad.getAttribute("id")); // debug statement
  return storyToLoad.getAttribute("id");
}