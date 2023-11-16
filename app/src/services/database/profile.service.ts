import {supabase} from "@/plugins/supabase";
import {ProfileDTO} from "@/types/auth.types.ts";

class ProfileServiceClass {

    public push = {
        updateProfileUsername: this.updateProfileUsername.bind(this),
        updateProfileAvatar: this.updateProfileAvatar.bind(this),
    };

    public pull = {
        fetchProfile: this.fetchProfile.bind(this),
        fetchTeachers: this.getTeachers.bind(this),
        fetchPoints: this.fetchPoints.bind(this),
        getAvatar: this.getAvatar.bind(this),
        getUsername: this.getUsername.bind(this),
        checkIfUsernameExists: this.checkIfUsernameExists.bind(this)
    }

    private async fetchProfile(userId: string): Promise<ProfileDTO | undefined>  {

        const {data, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return data;

    }

    private async fetchPoints(userId: string) {
        const {data, error} = await supabase
            .from('user_points')
            .select('points')
            .eq('user_id', userId)
            .single();

        if (error) throw error;

        return data;
    }

    private async getUsername(userId: string) {
        const {data, error} = await supabase
            .from('profiles')
            .select('username')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return data;

    }

    private async getAvatar(userId: string) {
        const {data, error} = await supabase
            .from('profiles')
            .select('avatar')
            .eq('id', userId)
            .single();

        if (error) throw error;

        return data;

    }

    private async getTeachers(): Promise<ProfileDTO[] | undefined> {
        const {data, error} = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'teacher')

        if (error) throw error;

        if (data && data.length > 0) {
            return data;
        }
    }

    private async checkIfUsernameExists(username: string) {
        const {data, error, status, count} = await supabase
            .from('profiles')
            .select('username', {count: 'exact', head: true})
            .eq('username', username)

        if (error) throw error;

        if (count) {
            return count > 0;
        }
    }

    private async updateProfileUsername(userUUID: string, username: string) {
        const {error} = await supabase
            .from('profiles')
            .update({username: username})
            .eq('id', userUUID)

        if (error) throw error;
    }

    private async updateProfileAvatar(userUUID: string, avatar: string) {
        const {error} = await supabase
            .from('profiles')
            .update({avatar: avatar})
            .eq('id', userUUID)

        if (error) throw error;
    }
}

const ProfileService = new ProfileServiceClass();

export default ProfileService;