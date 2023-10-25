import React, { useEffect, useState } from 'react';
//import { Button } from 'primereact/button';
import Plan from './plan';
//import ErrorBoundary from '../../utils/boundary'
import classNames from 'classnames';

const Plans = (props) => {    
    const [plans, setPlans] = useState();
    const [plan, setPlan] = useState();

    const getMsPlans = async () => {
        if(!plans)
            window.$memberstackDom.getPlans()
                .then(({ data: allPlans }) => setPlans(allPlans))
                .catch();
    };

    useEffect(() => {
        if(!plans)
            getMsPlans();
    });

    return (
        <div className={`plans`}>
            <div className={``}>
                <div className="grid">
                    <div className="col-2">&nbsp;</div>
                    <div className="col-10">
                        <div>
                            <div className={classNames('h-full', { 'border-transparent': plan !== 0, 'border-blue-500': plan===0, 'shadow--3': plan===0 })} onClick={() => setPlan(0)}>
                                <div className="p-3 flex flex-column align-items-center gap-3">
                                    <Plan plans={plans ? plans : []} />
                                </div>
                            </div>
                        </div>
                    </div>                    
                </div>
            </div>
        </div>
    );
  }

  export default Plans