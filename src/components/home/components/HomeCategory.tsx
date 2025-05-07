/* Import Dependencies */
import { useState } from "react"
import { Link } from "react-router-dom";
import CountUp from 'react-countup';
import classNames from 'classnames';
import { Row, Col } from 'react-bootstrap';

/* Import Styles */
import styles from '../home.module.scss';

/* Import Components */
import { Button } from "components/general/CustomComponents";


/* Props Type */
interface Props {
    title: string,
    subTitle: string,
    count: number,
    link: string,
    color: 'primary' | 'secondary' | 'tertiary'
};


/**
 * Component that renders a template for the category selection on the Home page
 * @param title The title of the category that should be displayed in large font
 * @param subTitle The text that will appear in smaller font below the title
 * @param count The total count of records the category holds
 * @param link The link the category should go to when clicked on
 * @param color The color code of the category indicated by the CSS order of: primary, secondary and tertiary
 * @returns JSX Component
 */
const HomeCategory = (props: Props) => {
    const { title, subTitle, count, link, color } = props;

    /* Base variables */
    const [active, setActive] = useState<boolean>(false);

    /* ClassNames */
    const hoverDivClass = classNames({
        [`${styles.homeCategoryBar} bgc-${color} tr-smooth z-1 position-absolute`]: true,
        'h-100': active,
        [`py-${window.innerWidth < 990 ? 1 : 3}`]: !active
    });

    const textClass = classNames({
        'tc-white': active
    });

    return (
        <Row className="h-100 position-relative"
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}
        >
            {/* Colored Bar, will extend to the bottom when hovered on this component */}
            <div className={hoverDivClass} />

            <Col className="flex-grow-1 z-2 mt-1 p-0">
                {/* Content of the category */}
                <Link to={link}>
                    <Row className="py-lg-5">
                        <Col className="d-flex flex-column justify-content-center text-center">
                            <p className={`${textClass} fs-1 tc-${color} fw-bold tr-smooth`}>
                                <CountUp end={count} />
                            </p>
                            <p className={`${textClass} fs-subTitle fw-lightBold tr-smooth`}>{title}</p>

                            {/* Button on mobile, title on desktop */}
                            <Button type="button"
                                variant="blank"
                                className={`tc-${color} d-block d-lg-none mt-2`}
                            >
                                {subTitle}
                            </Button>
                            <p className={`${textClass} fs-2 fw-lightBold tr-smooth d-none d-lg-block`}>{subTitle}</p>
                        </Col>
                    </Row>
                </Link>
            </Col>
        </Row>
    );
}

export default HomeCategory;