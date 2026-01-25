import JobListPage from '@/components/JobListPage';

export default function StateJobsPage({ params }: { params: { state: string } }) {
    const stateName = params.state.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    return (
        <JobListPage
            title={`Jobs in ${stateName}`}
            description={`Latest official job notifications for the state of ${stateName}.`}
            state={stateName}
        />
    );
}
