import Link from 'next/link';
import { Clock, MapPin, Building2, ChevronRight, GraduationCap } from 'lucide-react';

interface JobCardProps {
    job: {
        id: string;
        slug: string;
        title: string;
        organization: string;
        qualification: string;
        state?: string;
        category: string;
        createdAt: Date | string;
        expiresAt?: Date | string;
    };
}

const JobCard = ({ job }: JobCardProps) => {
    const getBadgeClass = (category: string) => {
        switch (category.toLowerCase()) {
            case 'govt': return 'badge-govt';
            case 'private': return 'badge-private';
            case 'result': return 'badge-result';
            case 'admit card': return 'badge-admit';
            default: return 'btn-outline';
        }
    };

    return (
        <Link href={`/jobs/${job.slug}`} className="job-card group">
            <div className="flex justify-between items-start mb-4">
                <span className={`badge ${getBadgeClass(job.category)}`}>
                    {job.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-secondary">
                    <Clock size={14} />
                    {new Date(job.createdAt).toLocaleDateString()}
                </div>
            </div>

            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {job.title}
            </h3>

            <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-secondary">
                    <Building2 size={16} />
                    <span>{job.organization}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-secondary">
                    <GraduationCap size={16} />
                    <span>{job.qualification}</span>
                </div>
                {job.state && (
                    <div className="flex items-center gap-2 text-sm text-secondary">
                        <MapPin size={16} />
                        <span>{job.state}</span>
                    </div>
                )}
            </div>

            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                <span className="text-xs font-semibold text-primary">View Details</span>
                <ChevronRight size={16} className="text-primary transform group-hover:translateX(4px) transition-transform" />
            </div>

            <style jsx>{`
        .job-card {
          background: var(--card-bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          height: 100%;
          transition: all 0.3s ease;
        }
        .job-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </Link>
    );
};

export default JobCard;
