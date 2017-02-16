import React from 'react';
import { render } from 'react-dom';

import styles from '../css/style.modules.scss?__url';

render(<div className={styles.page}>
    <h1>Hi</h1>
    <section className={styles.box}>box</section>
</div>);
