import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export default function DataCharts({ stream, prediction }) {
    const ref = useRef(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        el.innerHTML = ''
        const w = el.clientWidth || 300
        const h = 180
        const svg = d3.select(el).append('svg').attr('width', w).attr('height', h).classed('chart', true)

        const data = stream.map((d,i) => ({ i, v: d.temp }))
        if (data.length < 2) return
        const x = d3.scaleLinear().domain(d3.extent(data, d => d.i)).range([24, w-8])
        const y = d3.scaleLinear().domain(d3.extent(data, d => d.v)).nice().range([h-18, 10])

        const line = d3.line().x(d => x(d.i)).y(d => y(d.v)).curve(d3.curveCatmullRom.alpha(0.5))
        svg.append('path').attr('d', line(data)).attr('fill', 'none').attr('stroke', '#27c29a').attr('stroke-width', 2)

        if (prediction) {
            const x2 = data[data.length-1]?.i ?? 0
            const y2 = y(prediction.nextTemp)
            svg.append('circle').attr('cx', x(x2)).attr('cy', y2).attr('r', 4).attr('fill', prediction.delta > 0 ? 'red' : 'lime')
        }

        const ax = d3.axisBottom(x).ticks(5)
        const ay = d3.axisLeft(y).ticks(4)
        svg.append('g').attr('transform', `translate(0,${h-18})`).call(ax)
        svg.append('g').attr('transform', `translate(24,0)`).call(ay)
    }, [stream, prediction])

    return <div ref={ref} className="chart" />
}

