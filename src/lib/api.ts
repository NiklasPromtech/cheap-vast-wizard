const API_BASE_URL = 'https://vast-generator-m5ldl363aa-uc.a.run.app/api';

export interface VastTag {
  id: string;
  uid: string;
  tag_id: string;
  name: string;
  vast_url: string;
  active: boolean;
  imp_count: number;
  last_updated: string;
  created_at: string;
}

export interface Credits {
  uid: string;
  credit_usd: number;
  credit_imps_bought: number;
  credit_imps_used: number;
  last_usage_sync: string;
  status: 'active' | 'paused' | 'depleted';
}

export interface UploadResponse {
  success: boolean;
  videoUrl: string;
  vastTag: string;
  vastTagUrl: string;
  fileName: string;
  tag: VastTag;
}

export const vastApi = {
  async uploadVideo(file: File, uid: string): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('uid', uid);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload video');
    }

    return response.json();
  },

  async getTags(uid: string): Promise<VastTag[]> {
    const response = await fetch(`${API_BASE_URL}/tags?uid=${uid}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }

    const data = await response.json();
    return data.tags || [];
  },

  async updateTag(tagId: string, uid: string, updates: Partial<VastTag>): Promise<VastTag> {
    const response = await fetch(`${API_BASE_URL}/tags/${tagId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, ...updates }),
    });

    if (!response.ok) {
      throw new Error('Failed to update tag');
    }

    const data = await response.json();
    return data.tag;
  },

  async deleteTag(tagId: string, uid: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/tags/${tagId}?uid=${uid}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete tag');
    }
  },

  async getCredits(uid: string): Promise<Credits> {
    const response = await fetch(`${API_BASE_URL}/credits?uid=${uid}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch credits');
    }

    const data = await response.json();
    return data.credits;
  },
};
