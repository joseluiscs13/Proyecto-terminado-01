import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import Swal from "sweetalert2";
import { mdApi } from "../api";

export const useMDStore = () => {
    const dispatch = useDispatch();
    const {events, activeEvent} = useSelector(state => state.md);
    const {user} = useSelector(state => state.auth);

    const startSavingEvent = async(mdEvent) => {
        // TODO: llegar al backend

        try {
            // TODO: Update event
            if(mdEvent.id){
                // Actualizando
                await mdApi.put(`/events/${mdEvent.id}`, mdEvent);
                dispatch( onUpdateEvent({...mdEvent, user}) );
                return;
            }

            // Creando
            const {data} = await mdApi.post('/events', mdEvent);
            dispatch( onAddNewEvent({ ...mdEvent, id: data.evento.id, user }) );
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data.msg, 'error');
        }
    }

    // const startDeletingEvent = async() => {
    //     // TODO: llegar al backend
    //     try {
    //         await calendarApi.delete(`/events/${activeEvent.id}`);
    //         dispatch( onDeleteEvent() );
    //     } catch (error) {
    //         console.log(error);
    //         Swal.fire('Error al eliminar', error.response.data.msg, 'error');
    //     }

    // }

    const startLoadingEvents = async() => {
        try {
            const {data} = await mdApi.get('/events');
            const events = data.eventos;
            dispatch( onLoadEvents(events) );

        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error);
        }
    }

    return {
        // Properties
        activeEvent,
        events,
        // hasEventSelected: !!activeEvent,

        //Methods
        // startDeletingEvent,
        // setActiveEvent,
        startSavingEvent,
        startLoadingEvents,
    }
}
