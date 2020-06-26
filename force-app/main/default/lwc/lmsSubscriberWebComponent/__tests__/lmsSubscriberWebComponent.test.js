/* eslint-disable no-unused-vars */
// temporarily until completing tests
import { createElement } from 'lwc';
import LmsSubscriberWebComponent from 'c/lmsSubscriberWebComponent';
//import { ShowToastEventName } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';
import {
    registerLdsTestWireAdapter,
    registerTestWireAdapter
} from '@salesforce/sfdx-lwc-jest';

import { subscribe, MessageContext } from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/Record_Selected__c';

const mockGetRecord = require('./data/getRecord.json');
const mockGetRecordNoPicture = require('./data/getRecordNoPicture.json');

// Register as a LDS wire adapter. Some tests verify the provisioned values trigger desired behavior.
const getRecordAdapter = registerLdsTestWireAdapter(getRecord);

// Mock out the event firing function to verify it was called with expected parameters.
// jest.mock('lightning/messageService', () => {
//     return {
//         subscribe: jest.fn(),
//         MessageContext: jest.fn()
//     };
// });

// jest.mock(
//     '@salesforce/messageChannel/Record_Selected__c',
//     () => {
//         return {
//             recordSelected: 'mock_channel_id'
//         };
//     },
//     { virtual: true }
// );

// Register as a standard wire adapter because the component under test requires this adapter.
// We don't exercise this wire adapter in the tests.
registerTestWireAdapter(MessageContext);

describe('c-lms-subscriber-web-component', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('registers the LMS subscriber during the component lifecycle', () => {
        // Create initial element
        const element = createElement('c-lms-subscriber-web-component', {
            is: LmsSubscriberWebComponent
        });
        document.body.appendChild(element);

        // Validate if pubsub got registered after connected to the DOM
        expect(subscribe.mock.calls.length).toBe(1);
        expect(subscribe.mock.calls[0][1]).toBe(recordSelected);
    });

    describe('getRecord @wire data', () => {
        it('renders contact details with picture', () => {
            jest.mock('lightning/messageService', () => {
                return {
                    subscribe: (
                        messageContext,
                        messageChannel,
                        messageHandler
                    ) => {
                        messageHandler({ recordId: '001' });
                    }
                };
            });

            // Create element
            const element = createElement('c-lms-subscriber-web-component', {
                is: LmsSubscriberWebComponent
            });
            document.body.appendChild(element);

            const config = getRecordAdapter.getLastConfig();
            expect(config).toBe('001');
            // expect(recordId).toBe(mockGetRecord.result.fields.Id.value);

            // Emit data from @wire
            // getRecordAdapter.emit(mockGetRecord);

            // Return a promise to wait for any asynchronous DOM updates. Jest
            // will automatically wait for the Promise chain to complete before
            // ending the test and fail the test if the promise rejects.
            // return Promise.resolve().then(() => {

            //     const {recordId} = getRecordAdapter.getLastConfig();

            //     // Select elements for validation
            //     // const imgEl = element.shadowRoot.querySelector('img');
            //     // expect(imgEl.src).toBe(
            //     //     mockGetRecord.result.fields.Picture__c.value
            //     // );

            //     const nameEl = element.shadowRoot.querySelector('p');
            //     expect(nameEl.textContent).toEqual(
            //         mockGetRecord.result.fields.Name.value
            //     );

            //         const phoneEl = element.shadowRoot.querySelector(
            //             'lightning-formatted-phone'
            //         );
            //         expect(phoneEl.value).toBe(
            //             mockGetRecord.result.fields.Phone.value
            // );

            // const emailEl = element.shadowRoot.querySelector(
            //     'lightning-formatted-email'
            // );
            // expect(emailEl.value).toBe(
            //     mockGetRecord.result.fields.Email.value
            // );
        });
    });

    //     it('renders contact details without picture', () => {
    //         // Create element
    //         const element = createElement('c-lms-subscriber-web-component', {
    //             is: LmsSubscriberWebComponent
    //         });
    //         document.body.appendChild(element);

    //         // Emit data from @wire
    //         getRecordAdapter.emit(mockGetRecordNoPicture);

    //         // Return a promise to wait for any asynchronous DOM updates. Jest
    //         // will automatically wait for the Promise chain to complete before
    //         // ending the test and fail the test if the promise rejects.
    //         return Promise.resolve().then(() => {
    //             // Select elements for validation
    //             const imgEl = element.shadowRoot.querySelector('img');
    //             expect(imgEl).toBeNull();

    //             const nameEl = element.shadowRoot.querySelector('p');
    //             expect(nameEl.textContent).toBe(
    //                 mockGetRecordNoPicture.result.fields.Name.value
    //             );

    //             const phoneEl = element.shadowRoot.querySelector(
    //                 'lightning-formatted-phone'
    //             );
    //             expect(phoneEl.value).toBe(
    //                 mockGetRecordNoPicture.result.fields.Phone.value
    //             );

    //             const emailEl = element.shadowRoot.querySelector(
    //                 'lightning-formatted-email'
    //             );
    //             expect(emailEl.value).toBe(
    //                 mockGetRecordNoPicture.result.fields.Email.value
    //             );
    //         });
    // });
});

// describe('getRecord @wire error', () => {
//     it('displays a toast message', () => {
//         // Create initial element
//         const element = createElement('c-lms-subscriber-web-component', {
//             is: LmsSubscriberWebComponent
//         });
//         document.body.appendChild(element);

//         // Mock handler for toast event
//         const handler = jest.fn();
//         // Add event listener to catch toast event
//         element.addEventListener(ShowToastEventName, handler);

//         // Emit error from @wire
//         getRecordAdapter.error();

//         // Return a promise to wait for any asynchronous DOM updates. Jest
//         // will automatically wait for the Promise chain to complete before
//         // ending the test and fail the test if the promise rejects.
//         return Promise.resolve().then(() => {
//             expect(handler).toHaveBeenCalled();
//         });
//     });
// });
// });
