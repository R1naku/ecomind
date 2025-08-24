import React from 'react'
import { scenarios } from '../ml/model'

export default function ControlsPanel({ timeRange, setTimeRange, scenario, setScenario, personal, setPersonal }) {
    return (
        <div>
            <h3>Настройки</h3>

            <label className="label">Временной диапазон</label>
            <select className="btn" value={timeRange} onChange={e => setTimeRange(e.target.value)}>
                <option value="24h">Последние 24 часа</option>
                <option value="1y">Год</option>
                <option value="10y">Десятилетие</option>
                <option value="all">С индустриальной эпохи</option>
            </select>

        <div style={{heing:8}} />

            <label className="label">Сценарий решений</label>
            <select className="btn" value={scenario} onChange={e => setScenario(e.target.value)}>
                {scenarios.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>

            <div style={{height:8}} />

            <div className="panel" style={{padding:8}}>
                <div style={{fontWeight:600, marginBottom:6}}>Личный след</div>

                <label className="label">Перелёты / год: {personal.flights}</label>
                <input className="range" type="range" min="0" max="20"
                       value={personal.flights}
                       onChange={e => setPersonal(p => ({...p, flights: +e.target.value}))} />

                <label className="label">Порции мяса / неделю: {personal.meat}</label>
                <input className="range" type="range" min="0" max="14"
                       value={personal.meat}
                       onChange={e => setPersonal(p => ({...p, meat: +e.target.value}))} />

                <label className="label">Км на авто / день: {personal.carKm}</label>
                <input className="range" type="range" min="0" max="200"
                       value={personal.carKm}
                       onChange={e => setPersonal(p => ({...p, carKm: +e.target.value}))} />
            </div>
        </div>
    )
}
