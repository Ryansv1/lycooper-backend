## Routes for LycooperAPI

### API

/api/input POST

         expect:
            sensorId: string
            value: number

/api/collect GET

        expect:
            sensorId: string,
            date: string
