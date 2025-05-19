import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';

export const HotelListDetailsSummary = () => {
  return (
    <div className="cost-summary">
      <Accordion>
        <AccordionTab header="Día 1 - domingo, 18 de mayo de 2025">
          <Card title="Services">
            <div className="service-item">
              <span className="service-type">Transport</span>
              <span className="service-description">Airport Transfer</span>
              <span className="service-cost">$25.00</span>
            </div>
            <div className="service-item">
              <span className="service-type">Guide</span>
              <span className="service-description">Day Guide</span>
              <span className="service-cost">$80.00</span>
            </div>
            <div className="service-item">
              <span className="service-type">Meal</span>
              <span className="service-description">Welcome Dinner</span>
              <span className="service-cost">$35.00</span>
            </div>
          </Card>
          <Card title="Accommodations">
            <div className="accommodation-item">
              <span className="hotel-name">ANDINO CLUB HOTEL</span>
              <span className="room-type">Standard Single</span>
              <span className="room-capacity">1</span>
              <span className="room-category">3</span>
              <span className="room-cost">$12.21</span>
            </div>
            <div className="accommodation-item">
              <span className="hotel-name">ANDINO CLUB HOTEL</span>
              <span className="room-type">Standard Double</span>
              <span className="room-capacity">2</span>
              <span className="room-category">3</span>
              <span className="room-cost">$15.75</span>
            </div>
          </Card>
        </AccordionTab>
        <AccordionTab header="Día 2 - lunes, 19 de mayo de 2025">
          {/* Similar structure for day 2 */}
        </AccordionTab>
      </Accordion>
    </div>
  );
};
