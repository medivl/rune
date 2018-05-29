import * as tf from '@tensorflow/tfjs'

const LEARNING_RATE = 0.15
const optimizer = tf.train.sgd(LEARNING_RATE)
export const LABELS = {
  0: "square",
  1: "circle",
  2: "triangle",
  3: "star",
  4: "zigzag",
  5: "heart"
}

const NUM_CLASSES = Object.keys(LABELS).length

export default class Model {
  constructor() {
    this.model = tf.sequential()
    this.model.add(tf.layers.conv2d({
      inputShape: [28, 28, 1],
      kernelSize: 5,
      filters: 8,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'VarianceScaling'
    }))

    this.model.add(tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }))

    this.model.add(tf.layers.conv2d({
      kernelSize: 5,
      filters: 16,
      strides: 1,
      activation: 'relu',
      kernelInitializer: 'VarianceScaling'
    }))

    this.model.add(tf.layers.maxPooling2d({
      poolSize: [2, 2],
      strides: [2, 2]
    }))

    this.model.add(tf.layers.flatten())

    this.model.add(tf.layers.dense({
      units: NUM_CLASSES,
      kernelInitializer: 'VarianceScaling',
      activation: 'softmax'
    }))

    this.model.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })
  }

  async train(data, labels) {
    const BATCH_EPOCHS = 10

    const batchSize = data.length
    const batch = tf.tensor(data)

    const oneHotLabels = tf.oneHot(tf.tensor1d(labels, 'int32'), NUM_CLASSES)

    const history = await this.model.fit(batch, oneHotLabels, {
      batchSize: batchSize,
      epochs: BATCH_EPOCHS
    })

    return history
  }
}
