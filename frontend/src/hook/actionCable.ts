import ActionCable from 'actioncable';

const createCable = () => {
   return ActionCable.createConsumer('ws://localhost:3000/cable'); // Ganti URL sesuai server
};

export default createCable;
