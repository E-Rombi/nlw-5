import { createContext, useState, ReactNode, useContext } from 'react';
import Episode from '../pages/episodes/[slug]';

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Array<Episode>;
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    playNext: () => void;
    playPrevious: () => void;
    playList: (episodes: Array<Episode>, index: number) => void;
    togglePlay: () => void;
    toggleLooping: () => void;
    toggleShuffling: () => void;
    setPlayingState: (state: boolean) => void;
    clearPlayerState: () => void;
    hasNext: boolean;
    hasPrevious: boolean;
    isLooping: boolean;
    isShuffling: boolean;
}

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);

    function play(episode: Episode) {
        setEpisodeList([episode]);
        setCurrentEpisodeIndex(0);
        setIsPlaying(true);
    }

    function playList(episodes: Array<Episode>, index: number) {
        setEpisodeList(episodes);
        setCurrentEpisodeIndex(index);
        setIsPlaying(true);
    }

    function togglePlay() {
        setIsPlaying(!isPlaying);
    }

    function toggleLooping() {
        setIsLooping(!isLooping);
    }

    function toggleShuffling() {
        setIsShuffling(!isShuffling);
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state);
    }

    function clearPlayerState() {
        setEpisodeList([]);
        setCurrentEpisodeIndex(0);
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

    function playNext() {        
        if (isShuffling) {
            const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
            setCurrentEpisodeIndex(nextRandomEpisodeIndex)
        } else if (hasNext) {
            setCurrentEpisodeIndex(currentEpisodeIndex + 1);
        }
    }

    function playPrevious() {
        if (hasPrevious) {
            setCurrentEpisodeIndex(currentEpisodeIndex - 1);
        }   
    }

    return (
        <PlayerContext.Provider value={{ episodeList, 
            currentEpisodeIndex, 
            isPlaying, 
            play, 
            playNext, 
            playPrevious, 
            togglePlay, 
            setPlayingState, 
            playList, 
            hasNext, 
            hasPrevious, 
            isLooping, 
            toggleLooping,
            isShuffling,
            toggleShuffling,
            clearPlayerState}}
        >
            { children }
        </PlayerContext.Provider>
    );
}

export const usePlayer = () => {
    return useContext(PlayerContext);
}