import { PlayState } from "../reducers/player.reducer";
import { createSelector } from '@ngrx/store';

const selectPlayerState = (state: PlayState) => state;

export const getPlaying = createSelector(selectPlayerState, (state: PlayState) => state.playing);
export const getPlayList = createSelector(selectPlayerState, (state: PlayState) => state.playList);
export const getSongList = createSelector(selectPlayerState, (state: PlayState) => state.songList);
export const getPlayMode = createSelector(selectPlayerState, (state: PlayState) => state.playMode);
export const getCurrentIndex = createSelector(selectPlayerState, (state: PlayState) => state.currentIndex);

export const getCurrentSong = createSelector(selectPlayerState, ({playList, currentIndex}: PlayState) => playList[currentIndex]);
