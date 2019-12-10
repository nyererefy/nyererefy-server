import {getCustomRepository} from "typeorm";
import {ElectionRepository} from "../repositories/election/electionRepository";
import {SubcategoryRepository} from "../repositories/subcategory/subcategoryRepository";
import {CandidateRepository} from "../repositories/candidate/candidateRepository";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import fs from 'fs'
import {Candidate} from "../entities/candidate";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export async function generatePdf(electionId: number) {
    const electionRepository = getCustomRepository(ElectionRepository);
    const subcategoryRepository = getCustomRepository(SubcategoryRepository);
    const candidateRepository = getCustomRepository(CandidateRepository);

    let candidates: Candidate[] = [];
    const election = await electionRepository.findElection(electionId);
    const subcategories = await subcategoryRepository.findElectionSubcategoriesWithCandidates(electionId);

    for (let i = 0; i < subcategories.length; i++) {
        const subcategory = subcategories[i];

        candidates = await candidateRepository.findCandidatesAndCountVotes(subcategory.id);
    }

    let docs = {
        content: [
            {text: election.title, style: 'header'},
            `From ${election.startAt} to ${election.endAt}`,
            {
                style: 'subcategory',
                table: {
                    body: [['Candidate\'s Name', 'Votes Count', 'Status']]
                        .concat(candidates.map(c => {
                            const status = c.isWinner ? "Winner" : '';
                            return [c.user!.name!, c.votesCount.toString(), status]
                        })),
                },
            },
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            subcategory: {
                margin: [0, 5, 0, 15]
            },
            tableHeader: {
                bold: true,
                fontSize: 13,
                color: 'black'
            }
        },
        defaultStyle: {
            // alignment: 'justify'
        }
    };

    const subs = [];

    for (let i = 0; i < subcategories.length; i++) {
        const subcategory = subcategories[i];
        console.log('candidates', subcategory.candidates);

        const sub = {
            style: 'subcategory',
            table: {
                body: [['Candidate\'s Name', 'Votes Count', 'Status']]
                    .concat(subcategory.candidates.map(c => {
                        const status = c.isWinner ? "Winner" : '';
                        return ['c.id.toString()', 'c.votesCount.toString()', status]
                    })),
            },
        };

        subs.push(sub);
    }

    console.log(subs);
    docs = {
        ...docs, content: docs.content.concat(subs.map(c => c))
    };

    const pdf = pdfMake.createPdf(docs);

    pdf.getBuffer(buffer => {
        fs.writeFile('test.pdf', buffer, (err) => {
            console.error('err', err)
        })
    });

    return 'link'
}