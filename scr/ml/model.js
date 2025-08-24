import * as tf from '@tensorflow/tfjs'

export const scenarios = [
    { id: 'baseline', title: 'Базовый сценарий' },
    { id: 'reo-2050', title: 'Переход на ВИЭ к 2050' },
    { id: 'greening', title: 'Массовое озеленение' },
    { id: 'combo', title: 'Комбинированные меры' },
]

let model
async function ensureModel() {
    if (model) return model
    model = tf.sequential()
    model.add(tf.layers.dense({ units: 8, inputShape: [1], activation: 'relu' }))
    model.add(tf.layers.dense({ units: 1 }))
    model.compile({ loss: 'meanSquaredError', optimizer: 'adam' })
    // Быстрая «притирка» к синтетике — буквально несколько шагов
    const xs = tf.tensor1d([0,1,2,3,4,5,6,7,8,9])
    const ys = tf.tensor1d([0,0.1,0.12,0.15,0.22,0.3,0.33,0.37,0.42,0.5])
    await model.fit(xs, ys, { epochs: 20, verbose: 0 })
    return model
}

function scenarioDelta(id, personal) {
    let d = 0
    if (id === 'reo-2050') d -= 0.08
    if (id === 'greening') d -= 0.05
    if (id === 'combo') d -= 0.12

    d += (personal.flights * 0.002) + (personal.meat * 0.0015) + (personal.carKm * 0.0002)
    return d
}

export function applyScenario(stream, scenarioId, personal) {
    const temps = stream.map(s => s.temp)
    const last = temps[temps.length-1] ?? 0.2
    const d = scenarioDelta(scenarioId, personal)

    return {
        nextTemp: last + d,
        delta: d,
        details: { last, scenarioId }
    }
}

export async function predictWithTf(stream, scenarioId, personal) {
    await ensureModel()
    const xs = tf.tensor1d(stream.map((_, i) => i))
    const ys = tf.tensor1d(stream.map(s => s.temp))
    await model.fit(xs, ys, { epochs: 3, verbose: 0 })
    const nextX = tf.tensor1d([stream.length])
    const base = (await model.predict(nextX).data())[0]
    const d = scenarioDelta(scenarioId, personal)
    return base + d
}
