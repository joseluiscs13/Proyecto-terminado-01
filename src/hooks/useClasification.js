import * as tf from '@tensorflow/tfjs';
import { tracks } from '../data/tracks';

export const useClasification = async() => {
    // Obtener las emociones (datos)
    const nameSongs = tracks.map(track => track.name);
    const labels = tracks.map(track => track.tags);
    
    // Construcción del modelo
    const model = tf.sequential();
    model.add(tf.layers.embedding({ inputDim: 10000, outputDim: 16, inputLength: 100 }));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({ 
        optimizer: 'adam', 
        loss: 'binaryCrossentropy', 
        metrics: ['accuracy'] 
    });

    // Entrenamiento del modelo
    const history = await model.fit(tf.data.array(nameSongs), tf.data.array(labels), {
        epochs: 10,
        validationSplit: 0.2,
    });

    console.log({history});

    // Evaluación del modelo
    // const evalResult = model.evaluate(tf.data.array(testNames), tf.data.array(testLabels));
    // console.log('Test accuracy:', evalResult[1]);
    model.predict()

}