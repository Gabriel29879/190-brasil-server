import {
  Client,
  GeocodeResult,
  LocationType,
  PlaceType1,
  PlaceType2,
  ReverseGeocodeResponse,
  Status,
} from '@googlemaps/google-maps-services-js'
import { fromPromise, fromThrowable } from 'neverthrow'
import { baseExceptionHandler } from './exceptionHandler'

export type GoogleMapsApiFunctions = ReturnType<typeof googleMapsApiFunctions>

const createGoogleMapsClient = fromThrowable(() => new Client({}), baseExceptionHandler)

const findLocationInfo = (locationData: readonly GeocodeResult[], LocationType: string) =>
  locationData[0].address_components.find((locationInfo) => locationInfo.types.find((type) => type === LocationType))

const localEnvReverseGeocode = (): Promise<ReverseGeocodeResponse> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          statusText: 'OK',
          headers: {},
          config: {},
          data: {
            error_message: '',
            status: Status.OK,
            results: [
              {
                address_components: [
                  { types: [PlaceType2.administrative_area_level_1], long_name: '(DEV) São Paulo', short_name: 'SP' },
                  { types: [PlaceType2.administrative_area_level_2], long_name: '(DEV) São Paulo', short_name: 'SP' },
                ],
                formatted_address: '(DEV) Rua Quarenta e Sete, Jardim São Paulo(Zona Leste), São Paulo, SP - 08465312',
                geometry: {
                  location: {
                    lat: 37.4267861,
                    lng: -122.0806032,
                  },
                  location_type: LocationType.ROOFTOP,
                  viewport: {
                    northeast: {
                      lat: 37.4281350802915,
                      lng: -122.0792542197085,
                    },
                    southwest: {
                      lat: 37.4254371197085,
                      lng: -122.0819521802915,
                    },
                  },
                },
                place_id: 'ChIJtYuu0V25j4ARwu5e4wwRYgE',
                plus_code: {
                  compound_code: 'CWC8+R3 Mountain View, California, United States',
                  global_code: '849VCWC8+R3',
                },
                types: [PlaceType1.airport],
                partial_match: false,
                postcode_localities: [],
              },
            ],
          },
          status: 200,
        }),
      0,
    ),
  )

export const googleMapsApiFunctions = () => ({
  getGeocodeLocation: (latitude: number, longitude: number) =>
    createGoogleMapsClient()
      .asyncAndThen((googleMapsClient) =>
        fromPromise(
          process.env.DISABLE_GOOGLE_API
            ? localEnvReverseGeocode()
            : googleMapsClient.reverseGeocode({
                params: {
                  latlng: { lat: latitude, lng: longitude },
                  key: process.env.GOOGLE_API_KEY,
                },
                timeout: 1000,
              }),
          baseExceptionHandler,
        ),
      )
      .map(({ data: { results } }) => ({
        city: findLocationInfo(results, 'administrative_area_level_2')?.long_name || 'No city Found',
        state: findLocationInfo(results, 'administrative_area_level_1')?.short_name || 'No state Found',
        fullAddress: results[0].formatted_address,
      })),
})
