import { tracks } from "../data/tracks"
import { useMDStore } from "./useMDStore";

export const useEmotion = () => {

    const { events } = useMDStore();

    const getHappy = () => {
        const emotion = events.filter(event => event.tags == 'happy');

        return emotion;
    }

    const getSad = () => {
        const emotion = events.filter(event => event.tags == 'sad');

        return emotion;
    }

    const getExcited = () => {
        const emotion = events.filter(event => event.tags == 'excited');

        return emotion;
    }

    const getSurprised = () => {
        const emotion = events.filter(event => event.tags == 'surprised');

        return emotion;
    }

    return {
        getHappy,
        getExcited,
        getSurprised,
        getSad,
    }
}