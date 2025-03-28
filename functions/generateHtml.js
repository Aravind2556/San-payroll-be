const fs = require('fs');
const path = require('path');

// Generate HTML string using template literals
function generateHtml(PdfContent) {

    // Read and convert the logo image to a Base64 data URL
    const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
    const logoBase64 = fs.readFileSync(logoPath).toString('base64');
    const logoDataUrl = `data:image/png;base64,${logoBase64}`;

    return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Payspp - Oct 2024</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                .label{
                    font-size: 12px;
                }
                .input{
                    font-size: 13px;
                }
            </style>
        </head>

        <body class="w-[793.7007874px] h-[1122.519685px] bg-white pl-[96px] pr-[66px]  py-[66px] flex gap-10 flex-col font-medium">

            <!-- PAY SLIP -->
            <p class="font-bold text-[14px]">PAY SLIP ${PdfContent.month || 'Month'} ${PdfContent.year || 'Year'}</p>

            <!-- SAN ENGINEERING SOLUTIONS -->

            <div class="flex justify-between items-center">

                <div>
                    <p class="font-bold text-[12px] ">SAN ENGINEERING SOLUTIONS</p>
                    <p class="text-[11px] ">No. 29/3, KUBERALAKSHMI TOWERS, 3<sup>rd</sup> FLOOR,<br> OPP TO POST OFFICE, BUNGALOW
                        STREET,<br>PERUNDURAI – 638 052, ERODE DIST., TAMILNADU</p>
                </div>
                <img src=${logoDataUrl} class="h-[80px]" />

            </div>


            <!-- Employee Details -->
            <div>
                <p class=" label text-gray-700">NAME OF EMPLOYEE : <span class=" font-semibold text-black uppercase">${PdfContent.empName || 'Employee_Name'}</span></p>
                <hr class="my-2 border-black">

                <div class="grid">

                    <div class="grid grid-cols-4 gap-4 pl-2 text-sm">
                        <div>
                            <p class="text-gray-700 label">Employee ID </p>
                            <p class="font-semibold text-black input uppercase">${PdfContent.id || 'Emp ID'}</p>
                        </div>

                        <div>
                            <p class="text-gray-700 label">Date of Joined</p>
                            <p class="font-semibold text-black input">${PdfContent.doj || 'DOJ'}</p>
                        </div>
                        <div>
                            <p class="text-gray-700 label">Department</p>
                            <p class="font-semibold text-black input">${PdfContent.department || 'Department_Name'}</p>
                        </div>
                        <div>
                            <p class="text-gray-700 label">Job Title </p>
                            <p class="font-semibold text-black input">${PdfContent.designation || 'Designation'}</p>
                        </div>


                    </div>
                    <hr class="my-2 border-black ">


                    <div class="grid grid-cols-4 gap-4 pl-2">
                        <div>
                            <p class="text-gray-700 label">Payment Mode</p>
                            <p class="font-semibold text-black input">${PdfContent.paymentMode || 'Online/Offline'}</p>
                        </div>

                        <div>
                            <p class="text-gray-700 label">Name of the Bank </p>
                            <p class="font-semibold text-black input">${PdfContent.bankName || 'Bank_Name'}</p>
                        </div>
                        <div>
                            <p class="text-gray-700 label">Bank IFSC</p>
                            <p class="font-semibold text-black input uppercase">${PdfContent.bankIfsc || 'IFSCcode'}</p>
                        </div>
                        <div>
                            <p class="text-gray-700 label">Bank Account No.</p>
                            <p class="font-semibold text-black input">${PdfContent.accountNumber || 'Account_Number'}</p>
                        </div>
                    </div>
                    <hr class="my-2 border-black ">

                    <div class="grid grid-cols-4 pl-2 gap-4">
                        <div>
                            <p class="text-gray-700 label">UAN Number</p>
                            <p class="font-semibold text-black input">${PdfContent.UAN || 'UAN_Number'}</p>
                        </div>

                        <div>
                            <p class="text-gray-700 label">ESIC Number</p>
                            <p class="font-semibold text-black input">${PdfContent.ESICNumber || 'ESIC_Number'}</p>
                        </div>
                        <div>
                            <p class="text-gray-700 label">PAN Number</p>
                            <p class="font-semibold text-black input uppercase">${PdfContent.PANNumber || 'PAN_Number'}</p>
                        </div>
                        <div>
                            <p class="text-gray-700 label">Aadhaar Number</p>
                            <p class="font-semibold text-black input">${PdfContent.AadhaarNumber || 'Aadhaar_Number'}</p>
                        </div>
                    </div>
                </div>
                <hr class="my-2 border-black">

            </div>

            <!-- SALARY DETAILS -->
            <div>
                
                <p class="text-xs font-bold">SALARY DETAILS</p>

                <hr class="my-2  border-black">
                <div class="grid grid-cols-4 pl-2 gap-4">
                    <div>
                        <p class="text-gray-700 label">Actual Payable Days </p>
                        <p class="font-semibold text-black input">${PdfContent.actualPayableDays || 'Days'}</p>
                    </div>
                    <div>
                        <p class="text-gray-700 label">Total Working Days</p>
                        <p class="font-semibold text-black input">${PdfContent.totalWorkingDays || 'Days'}</p>
                    </div>
                    <div>
                        <p class="text-gray-700 label">Loss of Pay Days</p>
                        <p class="font-semibold text-black input">${PdfContent.LOP ?? 'LOP'}</p>
                    </div>
                    <div>
                        <p class="text-gray-700 label">Days Payable</p>
                        <p class="font-semibold text-black input">${PdfContent.payableDays || 'Days'}</p>
                    </div>

                </div>

                <hr class="my-2  border-black">



                <div class="flex gap-20 items-start pl-2 my-3 text-[12px]">
                    <!-- Earnings -->
                    <table>
                        <tr>
                            <td colspan="2"><h1 class="font-bold">EARNINGS</h1></td>
                        </tr>
                        <tr>
                            <td class="pl-10">Basic : </td>
                            <td class="px-3">${PdfContent.basic || 0}</td>
                        </tr>
                        <tr>
                            <td class="pl-10">HRA : </td>
                            <td class="px-3">${PdfContent.HRA || 0}</td>
                        </tr>
                        <tr>
                            <td class="pl-10">Conveyance Allowance : </td>
                            <td class="px-3">${PdfContent.conveyance || 0}</td>
                        </tr>
                        <tr>
                            <td>Total Earnings ( A ) : </td>
                            <td class="input px-3 font-bold">${PdfContent.totalEarningA || 0}</td>
                        </tr>
                    </table>
                
                    <table>
                        <!-- contribution -->
                        <tr>
                            <td colspan="2"><h1 class="font-bold">CONTRIBUTION</h1></td>
                        </tr>
                        <tr>
                            <td class="pl-10">EPF Employer : </td>
                            <td class="px-3">${PdfContent.EPF || 0}</td>
                        </tr>
                        <tr>
                            <td class="pl-10">ESI Employer : </td>
                            <td class="px-3">${PdfContent.ESI || 0}</td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                        </tr>
                        <tr>
                            <td>Total Contribution ( B ) : </td>
                            <td class="input px-3 font-bold">${PdfContent.totalContributionB || 0}</td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                        </tr>
                        <!-- taxes & contribution -->
                        <tr>
                            <td colspan="2"><h1 class="font-bold">TAXES & CONTRIBUTION</h1></td>
                        </tr>
                        <tr>
                            <td class="pl-10">Salary Advance : </td>
                            <td class="px-3">${PdfContent.salaryAdvance || 0}</td>
                        </tr>
                        <tr>
                            <td class="pl-10">TDS : </td>
                            <td class="px-3">${PdfContent.TDS || 0}</td>
                        </tr>
                        <tr>
                            <td class="pl-10">Other Deductions : </td>
                            <td class="px-3">${PdfContent.otherDeductions || 0}</td>
                        </tr>
                        <tr>
                            <td>Total Taxes & Deductions ( C ) : </td>
                            <td class="input px-3 font-bold">${PdfContent.totalDeductionsC || 0}</td>
                        </tr>
                    </table>

                </div>

                <div class="bg-gray-200 w-full p-5 mt-4 text-[14px]">
                    <div class="flex gap-2 mb-2">
                        <p class="">Net Salary Payable ( A – B – C ) : </p>
                        <p class="font-bold">${PdfContent.netSalaryPayable || 0} INR /-</p>
                    </div>
                    <div class="flex gap-2">
                        <p class=""> Net Salary in Words : </p>
                        <p class="font-bold">${PdfContent.salaryInWords || 0} Rupees only</p>
                    </div>
                </div>
            </div>


            <!--Note :  -->
            <div class="flex gap-10 text-[13px]">
                <p>Note :</p>
                <ol class="list-decimal">
                    <li> All amount displayed in this pay-slip are INR.</li>
                    <li>This is computer generated statement, does not require signature</li>
                    <li>HR Help Desk – <a href="tel:+917418969679">+91 74189 69679</a></li>
                </ol>
            </div>
        </body>

        </html>
    `;
}

module.exports = generateHtml;