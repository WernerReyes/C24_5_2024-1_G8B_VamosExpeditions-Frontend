import { SetAccomodationQuoteDto } from "@/domain/dtos/accommodationQuote";
import {
  useAccommodationQuoteStore,
  useQuotationStore,
} from "@/infraestructure/hooks";
import { Button, TabView, Tag } from "@/presentation/components";
import { useEffect, useState } from "react";

export const CostSummaryModule = () => {
  const { initialDate, daysNumber } = useQuotationStore();
  const { localAccommodationQuotes } = useAccommodationQuoteStore();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [localAccommodationQuotesPerDay, setLocalAccommodationQuotesPerDay] =
    useState<SetAccomodationQuoteDto[]>([]);

  useEffect(() => {
    setLocalAccommodationQuotesPerDay(
      localAccommodationQuotes.filter((quote) => quote.day === selectedDay)
    );
  }, [localAccommodationQuotes, selectedDay]);

  return (
    <div className="p-6 w-full bg-gray-100">
      <TabView
        scrollable
        onBeforeTabChange={(e) => {
          setSelectedDay(e.index + 1);
         
        }}
        // activeIndex={selectedDay - 1}

        
        tabPanelContent={
          Array.from({ length: daysNumber }).map((_, index) => ({
            header: `Día ${index + 1}`,
            children: (
              <div>
              {localAccommodationQuotesPerDay.length === 0 ? (
                <p className="text-center bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
                  Ningún alojamiento por ahora
                </p>
              ) : (
                <div className="w-full grid lg:grid-cols-2 gap-x-4 gap-y-8 justify-items-center jus bg-white">
                  {localAccommodationQuotesPerDay.map((quote) => (
                    <div
                      key={quote.accommodationRoom.id}
                      className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden"
                    >
                      {/* Header */}
                      <div className="bg-primary text-white p-4 items-center justify-between">
                        <div className="flex items-center justify-between">
                          <Tag
                            value="hotel"
                            className="bg-white text-primary rounded-lg px-5 py-0"
                          />
                          <Button icon="pi pi-trash" />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-white/20  rounded flex items-center justify-center">
                              <i className="pi text-xl pi-home"></i>
                            </div>
                            <div>
                              <h2 className="text-xl font-semibold">
                                {quote.accommodationRoom.accommodation.name}
                              </h2>
                              <small className="text-xs font-semibold text-secondary">
                                <i className="pi text-xs pi-map-marker me-1"></i>
                                {quote.accommodationRoom.accommodation.distrit.city.name}
                              </small>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <i className="pi pi-calendar"></i>
                              {/* <span>{quote.checkIn}</span> */}
                            </div>
                            <i className="pi pi-arrow-right"></i>
                            <div className="flex items-center gap-1">
                              <i className="pi pi-calendar"></i>
                              {/* <span>{quote.checkOut}</span> */}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-4">
                        <div className="flex items-center gap-2">
                          <i className="pi pi-user"></i>
                          <span>{quote.accommodationRoom.capacity}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <i className="pi pi-star"></i>
                          <span>{quote.accommodationRoom.accommodation.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            ),
          }))
        }

          // [
          // {
          //   header: "Header I",

          //   children: (
          //     <p>
          //       Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          //       eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
          //       enim ad minim veniam, quis nostrud exercitation ullamco laboris
          //       nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
          //       in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          //       nulla pariatur. Excepteur sint occaecat cupidatat non proident,
          //       sunt in culpa qui officia deserunt mollit anim id est laborum.
          //     </p>
          //   ),
          // },
          // {
          //   header: "Header II",
          //   children: (
          //     <p>
          //       Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          //       accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
          //       quae ab illo inventore veritatis et quasi architecto beatae
          //       vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
          //       voluptas sit aspernatur aut odit aut fugit, sed quia
          //       consequuntur magni dolores eos qui ratione voluptatem sequi
          //       nesciunt. Consectetur, adipisci velit, sed quia non numquam eius
          //       modi.
          //     </p>
          //   ),
          // },
          // {
          //   header: "Header III",
          //   children: (
          //     <p>
          //       At vero eos et accusamus et iusto odio dignissimos ducimus qui
          //       blanditiis praesentium voluptatum deleniti atque corrupti quos
          //       dolores et quas molestias excepturi sint occaecati cupiditate
          //       non provident, similique sunt in culpa qui officia deserunt
          //       mollitia animi, id est laborum et dolorum fuga. Et harum quidem
          //       rerum facilis est et expedita distinctio. Nam libero tempore,
          //       cum soluta nobis est eligendi optio cumque nihil impedit quo
          //       minus.
          //     </p>
          //   ),
          // },
          // {
          //   header: "Header IV",
          //   children: (
          //     <p>
          //       At vero eos et accusamus et iusto odio dignissimos ducimus qui
          //       blanditiis praesentium voluptatum deleniti atque corrupti quos
          //       dolores et quas molestias excepturi sint occaecati cupiditate
          //       non provident, similique sunt in culpa qui officia deserunt
          //       mollitia animi, id est laborum et dolorum fuga. Et harum quidem
          //       rerum facilis est et expedita distinctio. Nam libero tempore,
          //       cum soluta nobis est eligendi optio cumque nihil impedit quo
          //       minus.
          //     </p>
          //   ),
          // },
          // {
          //   header: "Header V",
          //   children: (
          //     <p>
          //       At vero eos et accusamus et iusto odio dignissimos ducimus qui
          //       blanditiis praesentium voluptatum deleniti atque corrupti quos
          //       dolores et quas molestias excepturi sint occaecati cupiditate
          //       non
          //     </p>
          //   ),
          // },
          // ]}
        
        
      />

      {/* <TabView
        scrollable
        pt={{
          ...Tailwind,
          nav: {
            className:
              "flex justify-evenly list-none overflow-x-auto overflow-y-hidden border border-gray-300  border-0 border-b-2 ",
          },
        }}
      >
        <TabPanel
          // headerClassName="bg-red-800 w-full"

          header="Header I"
        >
          <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </TabPanel>
        <TabPanel header="Header II">
          <p className="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
            quae ab illo inventore veritatis et quasi architecto beatae vitae
            dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
            aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
            eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci
            velit, sed quia non numquam eius modi.
          </p>
        </TabPanel>
        <TabPanel header="Header III">
          <p className="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis
            est et expedita distinctio. Nam libero tempore, cum soluta nobis est
            eligendi optio cumque nihil impedit quo minus.
          </p>
        </TabPanel>
        <TabPanel header="Header III">
          <p className="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis
            est et expedita distinctio. Nam libero tempore, cum soluta nobis est
            eligendi optio cumque nihil impedit quo minus.
          </p>
        </TabPanel>
        <TabPanel header="Header III">
          <p className="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis
            est et expedita distinctio. Nam libero tempore, cum soluta nobis est
            eligendi optio cumque nihil impedit quo minus.
          </p>
        </TabPanel>
        <TabPanel header="Header III">
          <p className="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui
            blanditiis praesentium voluptatum deleniti atque corrupti quos
            dolores et quas molestias excepturi sint occaecati cupiditate non
            provident, similique sunt in culpa qui officia deserunt mollitia
            animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis
            est et expedita distinctio. Nam libero tempore, cum soluta nobis est
            eligendi optio cumque nihil impedit quo minus.
          </p>
        </TabPanel>
      </TabView> */}

      {/* Selección de días */}
      <div className="flex gap-4 mb-4">
        {[1, 2, 3, 4].map((day) => (
          <label key={day} className="flex items-center">
            <input type="checkbox" className="mr-2" />
            Día {day}
          </label>
        ))}
      </div>

      {/* Secciones por día */}
      {[1, 2, 3].map((day) => (
        <div key={day} className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Día {day}</h2>
          <div className="space-y-4">
            {[
              "Transporte",
              "Actividades",
              "Almuerzos",
              "Cenas",
              "Alojamiento",
            ].map((category) => (
              <div key={category} className="bg-white p-4 rounded shadow-md">
                <h3 className="font-bold mb-2">{category}</h3>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Agregar {category.toLowerCase()}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Tabla resumen */}
      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-bold mb-4">Cálculo de margen</h3>

        {/* Control de margen */}
        <div className="flex items-center gap-4 mb-4">
          <label htmlFor="margin" className="font-semibold">
            Margen (%)
          </label>
          <input type="range" id="margin" min="0" max="50" className="w-full" />
        </div>

        {/* Tabla */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Día</th>
              <th className="py-2">Transporte</th>
              <th className="py-2">Actividades</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((day) => (
              <tr key={day} className="border-b">
                <td className="py-2">Día {day}</td>
                <td className="py-2">$0.00</td>
                <td className="py-2">$0.00</td>
                <td className="py-2">$0.00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
